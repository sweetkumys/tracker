<template>
  <Header />
  <div class="container">
    <Balance :total="total" />
    <Expenses :income="+income" :expenses="+expenses" />
    <TransList 
      :transactions="transactions" 
      @transactionDeleted="handleTransactionDeleted" 
    />
    <NewTransaction @transactionSubmitted="handleTransactionSubmitted" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore'; 
import { app } from './firebase.js'; // Adjust path if necessary

import Header from './components/Header.vue';
import Balance from './components/Balance.vue';
import Expenses from './components/Expenses.vue';
import TransList from './components/TransList.vue';
import NewTransaction from './components/NewTransaction.vue';

const toast = useToast();
const db = getFirestore(app);
const transactionsCollection = collection(db, 'transactions');
const transactions = ref([]);

onMounted(() => {
  // Subscribe to real-time updates from Firestore
  const unsubscribe = onSnapshot(transactionsCollection, (snapshot) => {
    transactions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });

  // Unsubscribe when the component is unmounted to avoid memory leaks
  onUnmounted(unsubscribe); 
});

const total = computed(() => {
  return transactions.value.reduce((acc, transaction) => acc + transaction.amount, 0);
});

const income = computed(() => {
  return transactions.value
    .filter(transaction => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2);
});

const expenses = computed(() => {
  return transactions.value
    .filter(transaction => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2);
});

const handleTransactionSubmitted = async (transactionData) => {
  try {
    await addDoc(transactionsCollection, transactionData);
    toast.success('Transaction added.');
  } catch (error) {
    console.error('Error adding transaction: ', error);
    toast.error('Failed to add transaction.');
  }
};

const handleTransactionDeleted = async (id) => {
  try {
    await deleteDoc(doc(db, 'transactions', id)); 
    toast.success('Transaction deleted.');
  } catch (error) {
    console.error('Error deleting transaction: ', error);
    toast.error('Failed to delete transaction.');
  }
};
</script>