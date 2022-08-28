import './productListPage.css';
import ProductCard from '../../components/productCard/ProductCard';
import { useState } from 'react';
import axios from 'axios';
import Spinner from '../../components/spinner/Spinner';
import Pagination from '../../components/pagination/Pagination';

const ProductListPage = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search === '') {
      return;
    }
    const getData = async () => {
      setIsLoading(true);
      const res = await axios.get(
        `https://munir-webscrapper-app.herokuapp.com/api/products/search?product=${search.toLowerCase()}`
      );
      const allRecords = [
        ...res.data.amazon,
        ...res.data.flipkart,
        ...res.data.snapdeal,
      ];
      setRecords(allRecords);
      setIsLoading(false);
      setSearch('');
    };
    getData();
  };

  // Get current records
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = records.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderProducts = (
    <>
      <div className='result-info'>
        {records.length > 0 ? (
          <h4>Total {records.length} records found</h4>
        ) : (
          ''
        )}
      </div>
      <div className='result-container'>
        {currentRecords.map((record) => (
          <ProductCard data={record} key={record._id} />
        ))}
      </div>
    </>
  );

  return (
    <div className='container-main'>
      <div className='search-container'>
        <form className='search-form' onSubmit={handleSubmit}>
          <input
            type='text'
            name='search'
            id='search'
            value={search}
            className='search-input'
            onChange={handleSearchChange}
            placeholder='Search Products'
          />
          <button className='btn-search'>search</button>
        </form>
        <div className='search-info'>
          <p>
            You may search products like "iphone 12", "iphone 11", "samsung
            m13", "samsung galaxy tab a8", "ipad mini", "ipad pro", "boat
            airdopes", "vivo y21", "redmi note 10", "oppo a15"
          </p>
        </div>
      </div>
      <div className='results'>
        {isLoading ? <Spinner /> : renderProducts}
        {records.length > 0 ? (
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={records.length}
            paginate={paginate}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
