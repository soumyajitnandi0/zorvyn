import { Transaction } from "./store";

export const initialTransactions: Transaction[] = [
  {
    id: "tx-1",
    date: "2024-03-28",
    description: "Salary deposit",
    category: "Salary",
    type: "income",
    amount: 5200.00,
    status: "completed"
  },
  {
    id: "tx-2",
    date: "2024-03-27",
    description: "Grocery Store",
    category: "Food",
    type: "expense",
    amount: 145.20,
    status: "completed"
  },
  {
    id: "tx-3",
    date: "2024-03-25",
    description: "Electric Bill",
    category: "Bills",
    type: "expense",
    amount: 85.00,
    status: "completed"
  },
  {
    id: "tx-4",
    date: "2024-03-24",
    description: "Freelance Project",
    category: "Freelance",
    type: "income",
    amount: 1250.00,
    status: "completed"
  },
  {
    id: "tx-5",
    date: "2024-03-22",
    description: "Online Shopping",
    category: "Shopping",
    type: "expense",
    amount: 210.50,
    status: "completed"
  },
  {
    id: "tx-6",
    date: "2024-03-20",
    description: "Coffee Shop",
    category: "Food",
    type: "expense",
    amount: 12.50,
    status: "completed"
  },
  {
    id: "tx-7",
    date: "2024-03-18",
    description: "Flight to NY",
    category: "Travel",
    type: "expense",
    amount: 450.00,
    status: "completed"
  },
  {
    id: "tx-8",
    date: "2024-03-15",
    description: "Gym Membership",
    category: "Health",
    type: "expense",
    amount: 50.00,
    status: "completed"
  },
  {
    id: "tx-9",
    date: "2024-03-12",
    description: "Movie Tickets",
    category: "Entertainment",
    type: "expense",
    amount: 35.00,
    status: "completed"
  },
  {
    id: "tx-10",
    date: "2024-03-10",
    description: "Apartment Rent",
    category: "Rent",
    type: "expense",
    amount: 1800.00,
    status: "completed"
  },
  {
    id: "tx-11",
    date: "2024-02-28",
    description: "Salary deposit",
    category: "Salary",
    type: "income",
    amount: 5200.00,
    status: "completed"
  },
  {
    id: "tx-12",
    date: "2024-02-25",
    description: "Restaurant Dinner",
    category: "Food",
    type: "expense",
    amount: 85.00,
    status: "completed"
  },
  {
    id: "tx-13",
    date: "2024-02-14",
    description: "Gift for Partner",
    category: "Shopping",
    type: "expense",
    amount: 150.00,
    status: "completed"
  },
  {
    id: "tx-14",
    date: "2024-02-05",
    description: "Online Course",
    category: "Education",
    type: "expense",
    amount: 199.00,
    status: "completed"
  }
];
