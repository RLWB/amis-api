const { faker } = require("@faker-js/faker/locale/zh_CN"); // 设置中文环境

// 创建连接池
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  database: "amis",
  password: "password",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

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

async function createFakeActivities() {
  try {
    // 创建表（如果不存在）
    await createTableIfNotExists();

    const activities = [];

    // 生成100条假数据
    for (let i = 0; i < 100; i++) {
      activities.push([
        faker.date.recent(365).toISOString().substring(0, 19), // 时间
        faker.internet.ip(), // IP地址
        faker.address.city(), // 地区
        faker.name.fullName(), // 姓名
        faker.name.sex(), // 性别
        faker.phone.number(), // 电话号码
        faker.image.avatar(), // 图片URL
      ]);
    }

    // 执行批量插入
    const insertQuery = `
      INSERT INTO events (time, ip, area, name, sex, tel, pic)
      VALUES ?
    `;

    await pool.query(insertQuery, [activities]);

    console.log("100 Activities created successfully.");
  } catch (error) {
    console.error("Error creating activities:", error);
  } finally {
    // 关闭连接池
    await pool.end();
  }
}

// 运行函数
createFakeActivities();
