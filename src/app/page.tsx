"use client"
import Button from "@/components/Button";
import Table from "@/components/Table";
import axios from "axios";
import { useEffect, useState } from "react";

export type Transaction = {
  idempotencyId: { S: string },
  amount: { N: number },
  type: { S: 'credit' | 'debit' },
}

export default function Home() {
  const [formatedTransactions, setFormatedTransactions] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<{} | undefined>(undefined)
  const [scriptIsExec, setScriptIsExec] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(process.env.SERVERLESS_API_URL as string);
        
        const transactions = response.data.Items
        setTotalRows(response.data.Count)
        
        if (transactions.length > 0) {
          setFormatedTransactions(() => {
            return transactions.map((transaction: Transaction) => {
              return {
                idempotencyId: transaction.idempotencyId.S,
                amount: formatter.format(transaction.amount.N / 100),
                type: transaction.type.S
              }
            })
          });
          if (response.data.LastEvaluatedKey?.idempotencyId?.S) {
            setLastEvaluatedKey(response.data.LastEvaluatedKey.idempotencyId.S)
          } else {
            setLastEvaluatedKey(undefined)  
          }
        } else {
          setFormatedTransactions([])
          setLastEvaluatedKey(undefined)
        }
        
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };

    fetchTransactions();
  }, []);  

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  const handleGetTransactions = async() => {
    let url = process.env.SERVERLESS_API_URL as string
    if (lastEvaluatedKey) {
      url = `${process.env.SERVERLESS_API_URL}?lastEvaluatedKey=${lastEvaluatedKey}`
    }

    const response = await axios.get(url);
    const transactions = response?.data?.Items || []
    setTotalRows(response.data.Count)

    if (transactions.length > 0) {
      setFormatedTransactions(() => {
        return transactions.map((transaction: Transaction) => {
          return {
            idempotencyId: transaction.idempotencyId.S,
            amount: formatter.format(transaction.amount.N / 100),
            type: transaction.type.S
          }
        })
      });
      if (response.data.LastEvaluatedKey?.idempotencyId?.S) {
        setLastEvaluatedKey(response.data.LastEvaluatedKey.idempotencyId.S)
      } else {
        setLastEvaluatedKey(undefined)  
      }
    } else {
      setFormatedTransactions([])
      setLastEvaluatedKey(undefined)
    }
  }

  const handleGenerateTransactiosScript = async() => {
    setScriptIsExec(true)
    const quantity = 100;
    try {
      for (let count = 0; count < quantity; count++) {
        
        const newTransaction = {
          amount: Math.floor(Math.random() * 10000),
          type: Math.random() < 0.5 ? 'credit' : 'debit',
        }
        await axios.post(process.env.BACKEND_API_URL as string, newTransaction);        
      }
      handleGetTransactions()
      setScriptIsExec(false)
    } catch (error) {
      setScriptIsExec(false)
      console.log(error)  
    }    
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-24">
      <div className="container mx-auto py-6">
      <div className="flex items-center justify-between container mx-0">
      <h1 className="text-2xl font-bold mb-6">Transactions List (Total: {totalRows})</h1>        
        <Button 
          onClick={handleGenerateTransactiosScript} 
          children={scriptIsExec ? "Please wait: Script running" : "Script: Add 100 Transactions"}
          disabled={scriptIsExec}
        />
      </div>
      <Table transactions={formatedTransactions} />
      </div>      
        <div className="flex items-center justify-center space-x-4 container mb-4">
          <Button onClick={handleGetTransactions} children={lastEvaluatedKey ? "Next Page" : "First Page"} />
          {/* {lastEvaluatedKey ? <Button onClick={handleGetTransactions} children="Next Page" />: null} */}
        </div>        
    </main>
  );
}
