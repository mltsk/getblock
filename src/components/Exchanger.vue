<script>
const API_KEY = 'c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd';
export default {
  data() {
    return {
      leftValue: 0,
      leftSearch: '',
      leftСurrency: 'BTC',
      leftUrlImage: 'https://changenow.io/images/sprite/currencies/btc.svg',
      leftList: [],
      rightValue: 0,
      rightSearch: '',
      rightСurrency: 'ETH',
      rightUrlImage: 'https://changenow.io/images/sprite/currencies/eth.svg',
      pair: 'btc_eth',
      rightList: [],
      isError: false,
      currencies: [],
    }
  },
  methods: {
    showList(event) {
      const input = event.target.closest('.input');
      const search = input.nextElementSibling;
      input.classList.remove('flex');
      input.classList.add('hidden');
      search.classList.add('flex');
      search.classList.remove('hidden');
      search.querySelector('input').focus();
    },
    hideList(event) {
      const search = event.target.closest('.search');
      const input = search.previousElementSibling;
      input.classList.remove('hidden');
      input.classList.add('flex');
      search.classList.add('hidden');
      search.classList.remove('flex');
    },
    handleLeftListClick(ticker, urlImage) {
      const search = document.querySelector('#left-search');
      const input = document.querySelector('#left-input');
      input.classList.remove('hidden');
      input.classList.add('flex');
      search.classList.add('hidden');
      search.classList.remove('flex');
      this.leftСurrency = ticker.toUpperCase();
      this.leftUrlImage = urlImage;
      this.leftSearch = '';
    },
    handleRightListClick(ticker, urlImage) {
      const search = document.querySelector('#right-search');
      const input = document.querySelector('#right-input');
      input.classList.remove('hidden');
      input.classList.add('flex');
      search.classList.add('hidden');
      search.classList.remove('flex');
      this.rightСurrency = ticker.toUpperCase();
      this.rightUrlImage = urlImage;
      this.rightSearch = '';
    },
    getCurrencies() {
      fetch("https://api.changenow.io/v1/currencies?active=true", {
        method: 'GET',
        redirect: 'follow'
      })
        .then(response => response.json())
        .then(result => {
          this.currencies = result;
          this.leftList = result;
          this.rightList = result;
          })
        .catch(error => console.log('error', error));
    },
    getEstimated() {
      fetch(`https://api.changenow.io/v1/exchange-amount/${this.leftValue}/${this.pair}?api_key=${API_KEY}`, {
        method: 'GET',
        redirect: 'follow'
      })
        .then(response => response.json())
        .then(result => {
          if(result.error) {
            this.rightValue = '-';
            return;
          }
          this.rightValue = result.estimatedAmount
          })
        .catch(error => {
          this.rightValue = 0;
          console.log('error', error)
        });
    },
    getMinExchangeAmount() {
        this.isError = false;
        fetch(`https://api.changenow.io/v1/min-amount/${this.pair}?api_key=${API_KEY}`, {
          method: 'GET',
          redirect: 'follow'
        })
        .then(response => response.json())
        .then(result => {
          if (result.error) {
            this.isError = true;
          }
          this.leftValue = result.minAmount;
        })
        .catch(error => console.log(error)) 
    },
  },
  mounted() {
    this.getCurrencies();
    this.getMinExchangeAmount();
  },
  watch: {
    leftСurrency() {
      this.pair = `${this.leftСurrency}_${this.rightСurrency}`;
      this.getMinExchangeAmount();
    },
    rightСurrency () {
      this.pair = `${this.leftСurrency}_${this.rightСurrency}`;
      this.getEstimated();
    },
    leftValue() {
      this.getEstimated();
    },
    leftSearch(value) {
      if (!value) {
        this.leftList = this.currencies;
        return;
      }
      const result = this.currencies.filter(({ticker, name}) => {
        const re = new RegExp(value, 'i');
        const isMatchTicker = ticker.match(re) !== null;
        const isMatchName = name.match(re) !== null;
        return isMatchTicker || isMatchName;
      })
      this.leftList = result;
    },
    rightSearch(value) {
      if (!value) {
        this.rightList = this.currencies;
        return;
      }
      const result = this.currencies.filter(({ticker, name}) => {
        const re = new RegExp(value, 'i');
        const isMatchTicker = ticker.match(re) !== null;
        const isMatchName = name.match(re) !== null;
        return isMatchTicker || isMatchName;
      })
      this.rightList = result;
    },
    isError() {
      const error = document.querySelector('#error');
      this.isError ? error.classList.remove('hidden') : error.classList.add('hidden');
    }
  }
}

</script>
<template>
  <section class="flex flex-col items-center p-5 font-serif">
    <div class="flex flex-col items-start lg:self-start">
      <h2 class="text-4xl lg:text-5xl">Crypto Exchange</h2>
      <h3 class="text-xl mt-3">Exchange fast and easy</h3>
    </div>
    <form class="flex self-stretch flex-col mt-14">
      <!-- group of 2 input -->
      <div class="flex flex-col lg:flex-row">
        <!-- input -->
        <div id="left-input" class="input flex mt-4 lg:mt-0 px-4 bg-grey rounded-basic h-12 justify-around items-center flex-nowrap border border-gray-300 lg:w-1/2">
          <input class="bg-transparent flex-grow h-10 outline-none" type="text" v-model="leftValue">
          <span class="w-px h-7 bg-gray-300"></span>
          <div class=" w-44 h-10 flex items-center cursor-pointer" @click="showList">
            <img class="ml-8" :src="leftUrlImage" width="20" height="20">
            <span class="ml-4">{{leftСurrency}}</span>
            <img class="ml-auto" src="../assets/arrow-down.svg" width="16" height="16">
          </div>
        </div>
        <!-- search -->
        <div id="left-search" class="search hidden mt-4 lg:mt-0 lg:w-1/2 relative">
          <div class="flex w-full px-4 bg-grey rounded-t-basic h-12 justify-around items-center flex-nowrap border border-gray-300">
            <input class="bg-transparent outline-none flex-grow h-10" type="text" placeholder="Search" v-model="leftSearch">
            <img class="ml-auto cursor-pointer" src="../assets/close.svg" width="16" height="16" @click="hideList">
          </div>
          <!-- list -->
          <div class="flex absolute w-full top-full bg-grey rounded-b-basic justify-around items-center flex-nowrap border-b border-r border-l border-gray-300 z-10">
            <ul class="flex flex-col flex-grow h-36 overflow-scroll overflow-x-hidden">
              <li class="flex p-3 cursor-pointer hover:bg-gray-200" @click="handleLeftListClick(ticker, image)" :key="ticker" v-for="({ticker, name, image}) in leftList">
                <img :src="image" alt="BTC" width="20" height="20">
                <span class="pl-2">{{ticker.toUpperCase()}}</span>
                <p class="pl-3 text-gray-400">{{name}}</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="self-end mt-4 cursor-pointer lg:self-start lg:mt-3 lg:mx-4 transform lg:rotate-90">
          <img src="../assets/swap.svg" alt="swap" width="24" height="24">
        </div>
        <!-- input -->
        <div id="right-input" class="input flex mt-4 lg:mt-0 px-4 bg-grey rounded-basic h-12 justify-around items-center flex-nowrap border border-gray-300 lg:w-1/2">
          <input class="bg-transparent flex-grow h-10 outline-none" type="text" v-model="rightValue" readonly>
          <span class="w-px h-7 bg-gray-300"></span>
          <div class=" w-44 h-10 flex items-center cursor-pointer" @click="showList">
            <img class="ml-8" :src="rightUrlImage" width="20" height="20">
            <span class="ml-4">{{rightСurrency}}</span>
            <img class="ml-auto" src="../assets/arrow-down.svg" width="16" height="16">
          </div>
        </div>
        <!-- search -->
        <div id="right-search" class="search hidden mt-4 lg:mt-0 lg:w-1/2 relative">
          <div class="flex w-full px-4 bg-grey rounded-t-basic h-12 justify-around items-center flex-nowrap border border-gray-300">
            <input class="bg-transparent outline-none flex-grow h-10" type="text" placeholder="Search" v-model="rightSearch">
            <img class="ml-auto cursor-pointer" src="../assets/close.svg" width="16" height="16" @click="hideList">
          </div>
          <!-- list -->
          <div class="flex absolute w-full top-full bg-grey rounded-b-basic justify-around items-center flex-nowrap border-b border-r border-l border-gray-300 z-10">
            <ul class="flex flex-col flex-grow h-36 overflow-scroll overflow-x-hidden">
              <li class="flex p-3 cursor-pointer hover:bg-gray-200" @click="handleRightListClick(ticker, image)" :key="ticker" v-for="({ticker, name, image}) in rightList">
                <img :src="image" alt="BTC" width="20" height="20">
                <span class="pl-2">{{ticker.toUpperCase()}}</span>
                <p class="pl-3 text-gray-400">{{name}}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="flex flex-col lg:flex-row lg:items-end">
        <div class="flex flex-col mt-12 lg:mt-6 lg:mr-8 lg:w-full">
          <label class="flex" for="ethereum-address">Your Ethereum address</label>
          <div class="mt-2 lg:mt-0 px-4 bg-grey rounded-basic h-12 flex justify-around items-center flex-nowrap border border-gray-300">
           <input id="ethereum-address" class="bg-transparent flex-grow h-10 outline-none" type="text" value="">
          </div>
        </div>
        <!-- button -->
        <div class="flex flex-col relative">
          <button class="flex items-center justify-center mt-5 h-12 rounded-basic bg-blue hover:bg-blue-hover text-white font-bold py-4 lg:w-64" type="submit">EXCHANGE</button>
          <p id="error" class="hidden mt-2 text-red-600 absolute top-full left-1/2 transform -translate-x-1/2 w-64">This pair is disabled now</p>
        </div>
      </div>
    </form>
  </section>
</template>
