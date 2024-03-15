export type Transaction = {
  idempotencyId: string,
  amount: string,
  type: string,
}

type TableProps = {
  transactions: Transaction[];
};
const Table: React.FC< TableProps> = ({transactions}) => {
  return (
    
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">IdempotencyId</th>
              <th className="px-4 py-2 text-right">Amout</th>
              <th className="px-4 py-2 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction.idempotencyId}>
                <td className="border px-4 py-2">{transaction.idempotencyId}</td>
                <td className="border px-4 py-2 text-right">{transaction.amount}</td>
                <td className={`border px-4 py-2 ${transaction.type === 'credit' ? 'bg-green-200' : 'bg-red-200'}`}>{transaction.type}</td>                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
  );
};

export default Table;

//  SCRIPT
// PAGINATIOn
// DEPLOY