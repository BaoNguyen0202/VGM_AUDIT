import SQLite from 'react-native-sqlite-2';

const db = SQLite.openDatabase({ name: 'test.db', location: 'default' });

const executeQuery = (query, params = [], successCallback, errorCallback) => {
    db.transaction((tx) => {
        tx.executeSql(
            query,
            params,
            (_, results) => {
                console.log('Query executed successfully');
                successCallback(results);
            },
            (error) => {
                console.error('Query execution error:', error);
                errorCallback(error);
            },
        );
    });
};
const ensureProductTable = () => {
    checkTableStructure();
    createTable();
};

const checkTableStructure = () => {
    const query = 'PRAGMA table_info(product);';
    executeQuery(
        query,
        [],
        (results) => {
            const columns = results.rows.raw();
            console.log('Table structure:', columns);
        },
        (error) => console.error('Error checking table structure:', error),
    );
};

const createTable = () => {
    const query =
        'CREATE TABLE IF NOT EXISTS product (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, quantity INTEGER, description TEXT, imagePath TEXT,  submitPoint INTEGER)';
    executeQuery(
        query,
        [],
        () => console.log('Product table created successfully'),
        (error) => console.error('Error creating product table:', error),
    );
};

const dropProductTable = () => {
    const query = 'DROP TABLE IF EXISTS product';
    executeQuery(
        query,
        [],
        () => console.log('Product table dropped successfully'),
        (error) => console.error('Error dropping product table:', error),
    );
};
const insertProduct = (name, quantity, description, imagePath, submitPoint) => {
    const query = 'INSERT INTO product (name, quantity, description, imagePath, submitPoint) VALUES (?, ?, ?, ?, ?)';
    const params = [name, quantity, description, imagePath, submitPoint];
    executeQuery(
        query,
        params,
        (results) => {
            console.log('Product inserted successfully:', results);
        },
        (error) => console.error('Error inserting product:', error),
    );
};

const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM product';
        executeQuery(
            query,
            [],
            (results) => {
                const { rows } = results;
                const products = [];
                for (let i = 0; i < rows.length; i++) {
                    products.push(rows.item(i));
                }
                console.log('Products fetched successfully:', products);
                resolve(products);
            },
            (error) => {
                console.error('Error fetching products:', error);
                reject(error);
            },
        );
    });
};

const deleteProduct = (productId) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM product WHERE id = ?';
        executeQuery(
            query,
            [productId],
            () => {
                console.log(`Product with id ${productId} deleted successfully`);
                resolve();
            },
            (error) => {
                console.error(`Error deleting product with id ${productId}:`, error);
                reject(error);
            },
        );
    });
};

const insertPhoto = (path) => {
    const query = 'INSERT INTO photos (path) VALUES (?)';
    const params = [path];
    executeQuery(
        query,
        params,
        () => console.log('Photo inserted successfully'),
        (error) => console.error('Error inserting photo:', error),
    );
};

const getAllPhotos = (callback) => {
    const query = 'SELECT * FROM photos';
    executeQuery(
        query,
        [],
        (results) => {
            const photos = results.rows.raw();
            callback(photos);
        },
        (error) => console.error('Error fetching photos:', error),
    );
};

const deleteAllPhotos = () => {
    const query = 'DELETE FROM photos';
    executeQuery(
        query,
        [],
        () => console.log('All photos deleted successfully'),
        (error) => console.error('Error deleting all photos:', error),
    );
};

export {
    executeQuery,
    deleteAllPhotos,
    createTable,
    insertProduct,
    getAllProducts,
    insertPhoto,
    getAllPhotos,
    ensureProductTable,
    deleteProduct,
    dropProductTable
};
