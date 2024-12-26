import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 

const AdminPage = () => {
    const [customers, setCustomers] = useState([]);
    const [goldenCustomers, setGoldenCustomers] = useState([]); // State for golden customers
    const [totalSales, setTotalSales] = useState(0);
    const [lastMonthSales, setLastMonthSales] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const customerRes = await axios.get('http://localhost:5000/customers');
                setCustomers(customerRes.data);

                const goldenCustomersRes = await axios.get('http://localhost:5000/golden-customers');
                setGoldenCustomers(goldenCustomersRes.data);

                const totalSalesRes = await axios.get('http://localhost:5000/api/sales/total');
                setTotalSales(totalSalesRes.data.total_sales || 0);

                const lastMonthSalesRes = await axios.get('http://localhost:5000/api/sales/last-month');
                setLastMonthSales(lastMonthSalesRes.data.total_sales_last_month || 0);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data. Please try again later.');
            }
        };

        fetchData();
    }, []);

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2>Total Sales: ${totalSales}</h2>
            <h2>Last Month's Sales: ${lastMonthSales}</h2>
    
            <div className="scroll-container">
                <h3>Customer List:</h3>
                <ul className="customer-list">
                    {customers.length > 0 ? (
                        customers.map((customer) => (
                            <li key={customer.profile_id}>
                                {customer.first_name} {customer.last_name} ({customer.username})
                            </li>
                        ))
                    ) : (
                        <li>No customers found</li>
                    )}
                </ul>
    
                <h3>Golden Customers:</h3>
                <ul className="golden-customer-list">
                    {goldenCustomers.length > 0 ? (
                        goldenCustomers.map((customer) => (
                            <li key={customer.profile_id}>
                                {customer.first_name} {customer.last_name} ({customer.username}) - Total Spent: ${customer.total_spent}
                            </li>
                        ))
                    ) : (
                        <li>No golden customers found</li>
                    )}
                </ul>
            </div>
        </div>
    );
        
};

export default AdminPage;
