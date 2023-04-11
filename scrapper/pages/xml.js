import { useState } from 'react';
import { json2xlsx } from 'xlsx';

function App() {
  const [jsonData, setJsonData] = useState([
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' },
    { name: 'Bob', age: 40, city: 'Chicago' }
  ]);

  const handleDownload = () => {
    const sheet = json2xlsx(jsonData, { header: ['Name', 'Age', 'City'] });
    const fileName = 'data.xlsx';
    saveAs(sheet, fileName);
  };

  return (
    <div>
      <button onClick={handleDownload}>Download Excel</button>
    </div>
  );
}

export default App;
