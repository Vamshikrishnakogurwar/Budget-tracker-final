import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { ExpenseChart } from "./ExpenseChart";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'income', amount: 3000, category: 'Salary', description: 'Monthly salary', date: '2024-01-01' },
    { id: '2', type: 'expense', amount: 800, category: 'Rent', description: 'Monthly rent', date: '2024-01-02' },
    { id: '3', type: 'expense', amount: 200, category: 'Groceries', description: 'Weekly groceries', date: '2024-01-03' },
    { id: '4', type: 'expense', amount: 150, category: 'Utilities', description: 'Electricity bill', date: '2024-01-04' },
    { id: '5', type: 'income', amount: 500, category: 'Freelance', description: 'Website project', date: '2024-01-05' },
  ]);
  
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
    setShowTransactionForm(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Financial Dashboard</h1>
          <p className="text-muted-foreground">Track your income, expenses, and financial goals</p>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card transition-smooth hover:shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₹{totalIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-smooth hover:shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">₹{totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-smooth hover:shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-success' : 'text-destructive'}`}>
                ₹{netIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {netIncome >= 0 ? 'Positive' : 'Negative'} cash flow
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Button 
            onClick={() => setShowTransactionForm(true)}
            variant="gradient"
            size="lg"
            className="gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            Add Transaction
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Expense Breakdown
                </CardTitle>
                <CardDescription>
                  Visual breakdown of your spending categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseChart transactions={transactions} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div>
            <TransactionList 
              transactions={transactions} 
              onDelete={deleteTransaction}
            />
          </div>
        </div>

        {/* Transaction Form Modal */}
        {showTransactionForm && (
          <TransactionForm
            onSubmit={addTransaction}
            onClose={() => setShowTransactionForm(false)}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;