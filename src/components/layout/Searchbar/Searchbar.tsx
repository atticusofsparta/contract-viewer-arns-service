import { useEffect, useState } from 'react';

import eventEmitter from '../../../utils/events';
import './styles.css';

function Searchbar() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    eventEmitter.emit('warning', { message: search, name: 'searching...' });
  }, [search]);

  return (
    <div className="searchbar">
      <input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder="Search for a contract"
      />
    </div>
  );
}

export default Searchbar;
