const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise"); // 使用Promise版本的mysql2

// 创建连接池
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  database: "amis",
  password: "password",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 确保events表存在
async function createTableIfNotExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      time DATETIME,
      ip VARCHAR(45),
      area VARCHAR(255),
      name VARCHAR(255),
      sex VARCHAR(10),
      tel VARCHAR(20),
      pic VARCHAR(255)
    )
  `;
  await pool.query(createTableQuery);
}

// 在应用启动时检查并创建表
createTableIfNotExists().catch((error) => {
  console.error("Error creating table:", error);
});

/**
 * 添加活动
 */
router.post("/events", async (req, res) => {
  try {
    //获取ip地址
    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);
    const time = new Date().toISOString().substring(0, 19);
    const pic =
      "https://p6-passport.byteacctimg.com/img/user-avatar/83ec7611201a582ab513cbeeefb75fc4~100x100.awebp";
    const { area, name, sex, tel } = req.body;

    if (!area || !name || !sex || !tel || !pic) {
      return res
        .status(400)
        .json({ code: 100, msg: "Missing required fields" });
    }

    const insertQuery = `
      INSERT INTO events (time, ip, area, name, sex, tel, pic)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(insertQuery, [
      time,
      ip,
      area,
      name,
      sex,
      tel,
      pic,
    ]);

    res.json({ code: 200, msg: "添加成功", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 100, msg: error.message });
  }
});

/**
 * 查询活动列表并分页
 */
router.get("/events", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const offset = (page - 1) * perPage;

    const [countResult] = await pool.execute(
      "SELECT COUNT(*) as total FROM events"
    );
    const total = countResult[0].total;

    const [results] = await pool.query(
      `SELECT * FROM events ORDER BY time DESC LIMIT ? OFFSET ?`,
      [perPage, offset]
    );

    const paginatedResponse = {
      items: results,
      page,
      perPage,
      total,
    };

    res.json(paginatedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 100, msg: error.message });
  }
});

/**
 * 删除活动
 */
router.delete("/events/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const [result] = await pool.execute("DELETE FROM events WHERE id = ?", [
      eventId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 101, msg: "Event not found" });
    }

    res.json({ code: 200, msg: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 100, msg: error.message });
  }
});

/**
 * 编辑活动信息
 */
router.put("/events/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const time = new Date(req.body.time)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const { ip, area, name, sex, tel, pic } = req.body;

    if (!time || !ip || !area || !name || !sex || !tel || !pic) {
      return res
        .status(400)
        .json({ code: 100, msg: "Missing required fields" });
    }

    const updateQuery = `
      UPDATE events SET time = ?, ip = ?, area = ?, name = ?, sex = ?, tel = ?, pic = ?
      WHERE id = ?
    `;
    const [result] = await pool.execute(updateQuery, [
      time,
      ip,
      area,
      name,
      sex,
      tel,
      pic,
      eventId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 101, msg: "Event not found" });
    }

    res.json({ code: 200, msg: "Event updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 100, msg: error.message });
  }
});

module.exports = router;
