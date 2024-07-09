const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// 创建连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'amis',
    password: "Googledns8888.",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 添加用户的API
router.post('/users', (req, res) => {
    // 检查请求体是否有必要的数据
    if (!req.body.name || !req.body.age || !req.body.address || !req.body.tags) {
        return res.status(400).json({ code: 100, msg: 'Missing required fields' });
    }

    // 使用参数化查询来防止SQL注入
    const insertQuery = 'INSERT INTO users (name, age, address, tags) VALUES (?, ?, ?, ?)';
    pool.query(insertQuery, [req.body.name, req.body.age, req.body.address, req.body.tags], (error, results, fields) => {
        if (error) {
            // 插入数据失败
            return res.status(500).json({ code: 100, msg: error.message });
        }

        // 插入数据成功
        res.json({ code: 200, msg: '添加成功' });

        // 注意：不需要在这里关闭连接，因为连接池会自动管理连接
    });
});

// 查询用户列表并分页
router.get('/users', (req, res) => {
    const page = parseInt(req.query.page) || 1; // 默认第一页
    const perPage = parseInt(req.query.perPage) || 10; // 默认每页10条
    const offset = (page - 1) * perPage; // 计算偏移量

    // 构造查询SQL语句，使用LIMIT和OFFSET来实现分页
    const query = 'SELECT * FROM users LIMIT ? OFFSET ?';

    // 同时，我们也需要查询总记录数以计算总页数
    pool.query('SELECT COUNT(*) as total FROM users', (errorCount, resultsCount) => {
        if (errorCount) {
            return res.status(500).json({ code: 100, msg: errorCount.message });
        }

        const total = resultsCount[0].total;

        pool.query(query, [perPage, offset], (error, results) => {
            if (error) {
                return res.status(500).json({ code: 100, msg: error.message });
            }

            // 格式化返回数据
            const paginatedResponse = {
                items: results, // 直接使用查询结果作为items数组
                page: page,
                perPage: perPage,
                total: total
            };

            res.json(paginatedResponse); // 返回分页后的用户列表
        });
    });
})

// 删除用户
router.delete('/users/:id', (req, res) => {
    const userId = req.params.id; // 从URL参数中获取用户ID

    // 构造删除用户的SQL语句
    const query = 'DELETE FROM users WHERE id = ?';

    pool.query(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ code: 100, msg: error.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ code: 101, msg: 'User not found' });
        }

        // 删除成功
        res.json({ code: 200, msg: 'User deleted successfully' });
    });
});


// 编辑用户信息
router.put('/users/:id', (req, res) => {
    const userId = req.params.id; // 从URL参数中获取用户ID
    // 检查请求体是否包含必要的数据
    if (!req.body.name || !req.body.age || !req.body.address || !req.body.tags) {
        return res.status(400).json({ code: 100, msg: 'Missing required fields' });
    }

    // 构造更新用户信息的SQL语句
    const query = 'UPDATE users SET name = ?, age = ?, address = ?, tags = ? WHERE id = ?';

    pool.query(query, [req.body.name, req.body.age, req.body.address, req.body.tags, userId], (error, results) => {
        if (error) {
            return res.status(500).json({ code: 100, msg: error.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ code: 101, msg: 'User not found' });
        }

        // 更新成功
        res.json({ code: 200, msg: 'User updated successfully' });
    });
});


module.exports = router;