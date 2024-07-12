# 活动管理 API 文档


## 基础 URL

所有端点都是相对于您的 API 服务器的基础 URL。

## 端点

### 1. 添加活动

向数据库添加新活动。

- **URL:** `/events`
- **方法:** `POST`
- **请求体:**
  ```json
  {
    "area": "string",
    "name": "string",
    "sex": "string",
    "tel": "string"
  }
  ```
- **成功响应:**
  - **状态码:** 200
  - **内容:** 
    ```json
    {
      "code": 200,
      "msg": "添加成功",
      "result": {}
    }
    ```
- **错误响应:**
  - **状态码:** 400
  - **内容:** 
    ```json
    {
      "code": 100,
      "msg": "缺少必填字段"
    }
    ```
  - **状态码:** 500
  - **内容:** 
    ```json
    {
      "code": 100,
      "msg": "错误信息"
    }
    ```

### 2. 获取活动列表

获取分页的活动列表。

- **URL:** `/events`
- **方法:** `GET`
- **URL 参数:** 
  - `page` (可选): 页码 (默认: 1)
  - `perPage` (可选): 每页项目数 (默认: 10)
- **成功响应:**
  - **状态码:** 200
  - **内容:** 
    ```json
    {
      "items": [
        {
          "id": "number",
          "time": "string",
          "ip": "string",
          "area": "string",
          "name": "string",
          "sex": "string",
          "tel": "string",
          "pic": "string"
        }
      ],
      "page": "number",
      "perPage": "number",
      "total": "number"
    }
    ```
- **错误响应:**
  - **状态码:** 500
  - **内容:** 
    ```json
    {
      "code": 100,
      "msg": "错误信息"
    }
    ```

### 3. 删除活动

通过 ID 删除活动。

- **URL:** `/events/:id`
- **方法:** `DELETE`
- **URL 参数:** 
  - `id`: 活动 ID
- **成功响应:**
  - **状态码:** 200
  - **内容:** 
    ```json
    {
      "code": 200,
      "msg": "活动删除成功"
    }
    ```
- **错误响应:**
  - **状态码:** 404
  - **内容:** 
    ```json
    {
      "code": 101,
      "msg": "未找到活动"
    }
    ```
  - **状态码:** 500
  - **内容:** 
    ```json
    {
      "code": 100,
      "msg": "错误信息"
    }
    ```

### 4. 更新活动

更新现有活动。

- **URL:** `/events/:id`
- **方法:** `PUT`
- **URL 参数:** 
  - `id`: 活动 ID
- **请求体:**
  ```json
  {
    "time": "string",
    "ip": "string",
    "area": "string",
    "name": "string",
    "sex": "string",
    "tel": "string",
    "pic": "string"
  }
  ```
- **成功响应:**
  - **状态码:** 200
  - **内容:** 
    ```json
    {
      "code": 200,
      "msg": "活动更新成功"
    }
    ```
- **错误响应:**
  - **状态码:** 400
  - **内容:** 
    ```json
    {
      "code": 100,
      "msg": "缺少必填字段"
    }
    ```
  - **状态码:** 404
  - **内容:** 
    ```json
    {
      "code": 101,
      "msg": "未找到活动"
    }
    ```
  - **状态码:** 500
  - **内容:** 
    ```json
    {
      "code": 100,
      "msg": "错误信息"
    }
    ```

## 数据模型

events 表具有以下结构：

| 字段 | 类型         | 描述                |
|------|--------------|---------------------|
| id   | INT          | 自增主键            |
| time | DATETIME     | 活动时间            |
| ip   | VARCHAR(45)  | IP 地址             |
| area | VARCHAR(255) | 地区信息            |
| name | VARCHAR(255) | 参与者姓名          |
| sex  | VARCHAR(10)  | 参与者性别          |
| tel  | VARCHAR(20)  | 电话号码            |
| pic  | VARCHAR(255) | 参与者照片的 URL    |