<template>
  <div class="container">
    <NewTransaction @transactionSubmitted="addTransaction" />
    <Balance :total="balance" /> 
    <Expenses :income="totalIncome" :expenses="totalExpenses" />
    <TransList :transactions="transactions" 
                @transactionDeleted="deleteTransaction" />
    <ChartComponent :transactions="transactions" /> 
  </div>
</template>

<script>
import NewTransaction from './components/NewTransaction.vue';
import Balance from './components/Balance.vue'; 
import Expenses from './components/Expenses.vue';
import TransList from './components/TransList.vue';
import ChartComponent from './components/ChartComponent.vue';
import { ref, onMounted, computed } from 'vue';
import { db } from './firebase'; 
import { collection, onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';

export default {
  components: {
    NewTransaction,
    Balance, 
    Expenses,
    TransList,
    ChartComponent 
  },
  setup() {
    const transactions = ref([]);

    const addTransaction = async (transactionData) => {
      try {
        const transactionsCollection = collection(db, 'transactions');
        await addDoc(transactionsCollection, transactionData);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    };

    const deleteTransaction = async (id) => {
      try {
        await deleteDoc(doc(db, 'transactions', id));
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    };

    onMounted(async () => {
      try {
        const transactionsCollection = collection(db, 'transactions');
        onSnapshot(transactionsCollection, (snapshot) => {
          transactions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    });

    const totalIncome = computed(() => {
      return transactions.value
        .filter(transaction => transaction.amount > 0)
        .reduce((sum, transaction) => sum + transaction.amount, 0)
        .toFixed(2);
    });

    const totalExpenses = computed(() => {
      return Math.abs(transactions.value
        .filter(transaction => transaction.amount < 0)
        .reduce((sum, transaction) => sum + transaction.amount, 0))
        .toFixed(2); 
    });

    const balance = computed(() => {
      return (totalIncome.value - totalExpenses.value).toFixed(2);
    });

    return {
      transactions,
      addTransaction,
      deleteTransaction,
      totalIncome, 
      totalExpenses,
      balance 
    };
  }
};
</script>