/**
 * @module 代理请求
 * @time 2025-04-21
 * @author xujiale
*/

const https = require('https')
const http = require('http')
const config = require('./config')

// 公共头部
const publicHeader = (hostname) => {
    return {
        'Accept': '*/*',
        'Accept-Encoding': 'utf-8',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Connection': 'keep-alive',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
        'Host': hostname,
		'authorization': config.token
    }
}

// 流返回形式的get请求 [hostname主地址, path请求路径, 返回可读流]
const getStream = (hostname, path, port = 443, protocol = 'https') => {
    const httpClient = protocol == 'https' ? https : http
    return new Promise((resolve) => {
        httpClient.get({
            hostname,
            port,
            path,
            headers: publicHeader(hostname),
            rejectUnauthorized: false
        }, (res) => {
            resolve(res)
        })
    })
}

// 标准get请求
const get = (hostname, path, port = 443, protocol = 'https') => {
    const httpClient = protocol == 'https' ? https : http
    return new Promise((resolve, reject) => {
        httpClient.get({
            hostname,
            port,
            path,
            headers: publicHeader(hostname),
            rejectUnauthorized: false
        }, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error('请求失败, 状态码：' + res.statusCode))
            }
            res.setEncoding('utf8')
            let rawData = ''
            res.on('data', (chunk) => {
                rawData += chunk
            })
            res.on('end', () => {
                try {
                    resolve(rawData)
                } catch(e) {
                    reject(e)
                }
            })
        })
    })
}

// 标准post请求
const post = (hostname, path, data, port = 443, protocol = 'https', contentType = 'application/json') => {
    const httpClient = protocol == 'https' ? https : http
    return new Promise((resolve, reject) => {
        const request = httpClient.request({
            hostname,
            port,
            path,
            method: 'POST',
            headers: { ...publicHeader(hostname), 'Content-Length': Buffer.byteLength(data), 'Content-Type': contentType },
            rejectUnauthorized: false
        }, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error('请求失败, 状态码：' + res.statusCode))
            }
            res.setEncoding('utf8')
            let rawData = ''
            res.on('data', (chunk) => {
                rawData += chunk
            })
            res.on('end', () => {
                try {
                    resolve(rawData)
                } catch(e) {
                    reject(e)
                }
            })
        })
        request.write(data)
		request.end()
    })
}

module.exports = {
    getStream,
    get,
    post
}