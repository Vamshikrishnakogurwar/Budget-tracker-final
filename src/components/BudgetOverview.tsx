import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, AlertTriangle } from "lucide-react";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface BudgetOverviewProps {
  transactions: Transaction[];
}

const budgetLimits = {
  'Rent': 1000,
  'Groceries': 300,
  'Utilities': 200,
  'Transportation': 150,
  'Entertainment': 100,
  'Dining': 200,
  'Shopping': 150,
  'Healthcare': 100,
};

export const BudgetOverview = ({ transactions }: BudgetOverviewProps) => {
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const budgetData = Object.entries(budgetLimits).map(([category, limit]) => {
    const spent = expensesByCategory[category] || 0;
    const percentage = (spent / limit) * 100;
    const status = percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good';

    return {
      category,
      spent,
      limit,
      percentage: Math.min(percentage, 100),
      status,
    };
  });

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Budget Overview
        </CardTitle>
        <CardDescription>
          Track your spending against monthly budgets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgetData.map(({ category, spent, limit, percentage, status }) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{category}</span>
                <div className="flex items-center gap-2">
                  {status === 'over' && (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                  <span className="text-sm">
                    ${spent.toLocaleString()} / ${limit.toLocaleString()}
                  </span>
                </div>
              </div>
              <Progress 
                value={percentage} 
                className={`h-2 ${
                  status === 'over' 
                    ? '[&>div]:bg-destructive' 
                    : status === 'warning' 
                    ? '[&>div]:bg-warning' 
                    : '[&>div]:bg-success'
                }`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{percentage.toFixed(1)}% used</span>
                <span>
                  {status === 'over' 
                    ? `$${(spent - limit).toLocaleString()} over budget`
                    : `$${(limit - spent).toLocaleString()} remaining`
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};