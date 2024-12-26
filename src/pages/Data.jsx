    import React, { useEffect, useState } from "react";
    import axios from "axios";
    import {
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TableRow,
        Paper,
        TablePagination,
    } from '@mui/material';
    import './Data.css';

    // Synonym mapping and acronym expansion
    const synonymMap = {
        processor: ["cpu", "core", "processor"],
        ram: ["ram", "memory"],
        storage: ["storage", "disk space", "capacity"],
        os: ["os", "operating system"],
        price: ["price", "cost", "value"],
    };

    const expandAcronyms = (term) => {
            const acronyms = {
            cpu: "processor",
            ram: "memory",
            os: "operating system",
        };
        return acronyms[term.toLowerCase()] || term.toLowerCase();
    };

    const tokenize = (field) => field.toLowerCase().replace(/_/g, " ").split(" ");

    const linguisticMatch = (field, candidates) => {
        const tokens = tokenize(expandAcronyms(field));
        return candidates.find(candidate =>
            tokens.some(token => synonymMap[candidate]?.includes(token))
        ) || field; // Default to original field if no match
    };

    // String similarity measures
    const levenshteinDistance = (a, b) => {
        const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++) dp[i][0] = i;
        for (let j = 0; j <= b.length; j++) dp[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
                );
            }
        }
        return dp[a.length][b.length];
    };

    const jaroWinkler = (a, b) => {
        const { compareTwoStrings } = require('string-similarity');
        return compareTwoStrings(a, b);
    };  

    const calculateSimilarity = (input, target) => {
        if (!input || !target) return 0;
        const normalizedInput = input.toLowerCase();
        const normalizedTarget = target.toLowerCase();
        const distance = levenshteinDistance(normalizedInput, normalizedTarget);
        const maxLen = Math.max(normalizedInput.length, normalizedTarget.length);
        const editDistanceScore = 1 - distance / maxLen;
        const jaroScore = jaroWinkler(normalizedInput, normalizedTarget);
        return (editDistanceScore + jaroScore) / 2;
    };

    // Transform and map data from both databases
    const transformData = (data, source) =>
        data.map(item => ({
            name: item["name"] || `${item["Manufacturer"] || ""} ${item["Model Name"] || ""}`.trim(),
            processor: item[linguisticMatch("processor", Object.keys(item))],
            ram: item[linguisticMatch("ram", Object.keys(item))],
            storage: item[linguisticMatch("storage", Object.keys(item))],
            os: item[linguisticMatch("os", Object.keys(item))],
            price: item[linguisticMatch("price", Object.keys(item))],
            source,
        }));

    // Filter laptops by similarity
    const filterBySimilarity = (laptops, searchCriteria) => {
        const threshold = 0.8;
        return laptops.filter((laptop) => {
            let totalScore = 0;
            let fieldsChecked = 0;

            // Match each search criterion with corresponding field
            Object.entries(searchCriteria).forEach(([key, value]) => {
                if (value) {
                    const similarity = calculateSimilarity(value, laptop[key] || "");
                    totalScore += similarity;
                    fieldsChecked++;
                }
            });

            const averageScore = fieldsChecked ? totalScore / fieldsChecked : 0;
            return averageScore >= threshold;
        });
    };

    const Data = () => {
        const [laptops, setLaptops] = useState([]);
        const [page, setPage] = useState(0);
        const [rowsPerPage, setRowsPerPage] = useState(10);
        const [searchCriteria, setSearchCriteria] = useState({
            name: "",
            processor: "",
            ram: "",
            storage: "",
            os: "",
        });

        useEffect(() => {
            const fetchMergedData = async () => {
                try {
                    const res = await axios.get("http://localhost:1234/merged");

                    const database1Transformed = transformData(res.data.database1, "Database 1");
                    const database2Transformed = transformData(res.data.database2, "Database 2");

                    setLaptops([...database1Transformed, ...database2Transformed]);
                } catch (err) {
                    console.error("Error fetching data:", err);
                }
            };

            fetchMergedData();
        }, []);

        const handleSearchChange = (field, value) => {
            setSearchCriteria((prev) => ({ ...prev, [field]: value }));
        };

        const filteredLaptops = filterBySimilarity(laptops, searchCriteria);

        const handleChangePage = (event, newPage) => setPage(newPage);

        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
        };

        const columns = [
            { id: 'name', label: 'Name', minWidth: 170 },
            { id: 'processor', label: 'Processor', minWidth: 100 },
            { id: 'ram', label: 'RAM', minWidth: 100 },
            { id: 'storage', label: 'Storage', minWidth: 100 },
            { id: 'os', label: 'OS', minWidth: 100 },
            { id: 'price', label: 'Price', minWidth: 100 },
            { id: 'source', label: 'Source', minWidth: 100 },
        ];

        return (
            <div className="data-container">
                <h1>Filter Laptops Based on Your Criteria</h1>

                <div className="search-boxes">
                    {["name", "processor", "ram", "storage", "os"].map((field, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={`Search by ${field}`}
                            value={searchCriteria[field]}
                            onChange={(e) => handleSearchChange(field, e.target.value)}
                        />
                    ))}
                </div>

                <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '20px', borderRadius: '10px' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align="left"
                                            style={{ minWidth: column.minWidth, backgroundColor: "#00A9FF" }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredLaptops
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((laptop, index) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            {columns.map((column) => (
                                                <TableCell key={column.id} align="left">
                                                    {laptop[column.id]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={filteredLaptops.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        );
    };

    export default Data;
