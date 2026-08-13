/*
 * Automatically generated from:
 * https://github.com/cmliu/edgetunnel/blob/main/_worker.js
 *
 * Upstream commit: ea1460da8206b9dad88e73a146246315806875db
 * Processed with Terser. Do not edit manually.
 */

const Version = "2026-08-11 14:45:22";

let config_JSON, 缓存SOCKS5白名单 = null, 调试日志打印 = !1, SOCKS5白名单 = [ "*tapecontent.net", "*cloudatacdn.com", "*loadshare.org", "*cdn-centaurus.com", "scholar.google.com" ];

const Pages静态页面 = "https://edt-pages.github.io", WS早期数据最大字节 = 8192, WS早期数据最大头长度 = Math.ceil(32768 / 3) + 4, 上行合包目标字节 = 20480, 上行队列最大字节 = 16777216, 上行队列最大条目 = 4096, 下行Grain包字节 = 32768, 下行Grain尾部阈值 = 512, 下行Grain低水位字节 = Math.max(4096, 6144), 下行Grain最大等待轮次 = 4;

let TCP并发拨号数 = 2, 反代并发拨号数 = 1, 预加载竞速拨号 = !1;

const 特征码字典 = [ (Proxy.name + "IP").toUpperCase(), (String.fromCharCode(67, 109) + URL.name[2] + "i" + URL.name[0]).toLowerCase(), String(722090).split("").reverse().join("") ];

export default {
    async fetch(e, t, n) {
        let r = e.url.replace(/%5[Cc]/g, "").replace(/\\/g, "");
        const a = r.indexOf("#"), s = -1 === a ? r : r.slice(0, a);
        if (!s.includes("?") && /%3f/i.test(s)) {
            const e = -1 === a ? "" : r.slice(a);
            r = s.replace(/%3f/i, "?") + e;
        }
        const o = new URL(r), i = e.headers.get("User-Agent") || "null", c = (e.headers.get("Upgrade") || "").toLowerCase(), l = (e.headers.get("content-type") || "").toLowerCase(), u = t.ADMIN || t.admin || t.PASSWORD || t.password || t.pswd || t.TOKEN || t.KEY || t.UUID || t.uuid, h = t.KEY || "勿动此默认密钥，有需求请自行通过添加变量KEY进行修改", f = await MD5MD5(u + h), d = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/, g = t.UUID || t.uuid, y = g && d.test(g) ? g.toLowerCase() : [ f.slice(0, 8), f.slice(8, 12), "4" + f.slice(13, 16), "8" + f.slice(17, 20), f.slice(20) ].join("-"), p = (t.HOST ? (await 整理成数组(t.HOST)).map(e => e.toLowerCase().replace(/^https?:\/\//, "").split("/")[0].split(":")[0]) : [ o.hostname ])[0], w = o.pathname.slice(1).toLowerCase();
        调试日志打印 = [ "1", "true" ].includes(t.DEBUG) || 调试日志打印, 预加载竞速拨号 = [ "1", "true" ].includes(t.PRELOAD_RACE_DIAL) || 预加载竞速拨号, 
        反代并发拨号数 = Math.max(1, Number(t.PROXY_CONCURRENT_DIAL) || 反代并发拨号数), TCP并发拨号数 = Math.max(1, Number(t.TCP_CONCURRENT_DIAL) || TCP并发拨号数), 
        t.TCP_CONCURRENT_DIAL || 1 === TCP并发拨号数 || "cmcc" !== 识别运营商(e) || (TCP并发拨号数 = 1);
        let S = `${e.cf.colo}.${特征码字典[0]}.${特征码字典[1]}SsSs.nEt`.toLowerCase(), m = !0;
        if (t.PROXYIP) {
            const e = await 整理成数组(t.PROXYIP);
            S = e[Math.floor(Math.random() * e.length)], m = !1;
        }
        const T = e.headers.get("CF-Connecting-IP") || e.headers.get("True-Client-IP") || e.headers.get("X-Real-IP") || e.headers.get("X-Forwarded-For") || e.headers.get("Fly-Client-IP") || e.headers.get("X-Appengine-Remote-Addr") || e.headers.get("X-Cluster-Client-IP") || "未知IP";
        if (null === 缓存SOCKS5白名单 ? (t.GO2SOCKS5 && (SOCKS5白名单 = [ ...new Set(SOCKS5白名单.concat(await 整理成数组(t.GO2SOCKS5))) ]), 
        缓存SOCKS5白名单 = SOCKS5白名单) : SOCKS5白名单 = 缓存SOCKS5白名单, "version" === w) {
            const e = (o.searchParams.get("uuid") || "").toLowerCase();
            if (d.test(e)) {
                const t = String(y).toLowerCase();
                let n = 0, r = 0;
                for (let a = 0; a < 8; a++) {
                    const s = e.charCodeAt(a);
                    n += s <= 57 ? s - 48 : s - 87;
                    const o = t.charCodeAt(a);
                    r += o <= 57 ? o - 48 : o - 87;
                }
                if (n === r && e.slice(-12) === t.slice(-12)) return new Response(JSON.stringify({
                    Version: Number(String(Version).replace(/\D+/g, ""))
                }), {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    }
                });
            }
        } else {
            if (u && "websocket" === c) {
                const t = await 反代参数获取(o, y, S, m);
                return log(`[WebSocket] 命中请求: ${o.pathname}${o.search}`), await 处理WS请求(e, y, o, t);
            }
            if (u && !w.startsWith("admin/") && "login" !== w && "POST" === e.method) {
                const t = await 反代参数获取(o, y, S, m), {"头": n, "键": r} = 获取叉HTTPPadding标识(y);
                return !e.headers.get(n) && !o.searchParams.get(r) && l.startsWith("application/grpc") ? (log(`[gRPC] 命中请求: ${o.pathname}${o.search}`), 
                await 处理gRPC请求(e, y, t)) : (log(`[叉HTTP] 命中请求: ${o.pathname}${o.search}`), await 处理叉HTTP请求(e, y, t));
            }
            if ("http:" === o.protocol) return Response.redirect(o.href.replace(`http://${o.hostname}`, `https://${o.hostname}`), 301);
            if (!u) return fetch(Pages静态页面 + "/noADMIN").then(e => {
                const t = new Headers(e.headers);
                return t.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"), 
                t.set("Pragma", "no-cache"), t.set("Expires", "0"), new Response(e.body, {
                    status: 404,
                    statusText: e.statusText,
                    headers: t
                });
            });
            if (t.KV && "function" == typeof t.KV.get) {
                const r = o.pathname.slice(1);
                if (r === h && "勿动此默认密钥，有需求请自行通过添加变量KEY进行修改" !== h) {
                    const e = new URLSearchParams(o.search);
                    return e.set("token", await MD5MD5(p + y)), new Response("重定向中...", {
                        status: 302,
                        headers: {
                            Location: `/sub?${e.toString()}`
                        }
                    });
                }
                if ("login" === w) {
                    const t = e.headers.get("Cookie") || "", n = t.split(";").find(e => e.trim().startsWith("auth="))?.split("=")[1];
                    if (n == await MD5MD5(i + h + u)) return new Response("重定向中...", {
                        status: 302,
                        headers: {
                            Location: "/admin"
                        }
                    });
                    if ("POST" === e.method) {
                        const t = await e.text();
                        if (new URLSearchParams(t).get("password") === ("string" == typeof u ? u.replace(/[\r\n]/g, "") : u)) {
                            const e = new Response(JSON.stringify({
                                success: !0
                            }), {
                                status: 200,
                                headers: {
                                    "Content-Type": "application/json;charset=utf-8"
                                }
                            });
                            return e.headers.set("Set-Cookie", `auth=${await MD5MD5(i + h + u)}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`), 
                            e;
                        }
                    }
                    return fetch(Pages静态页面 + "/login");
                }
                if ("admin" === w || w.startsWith("admin/")) {
                    const a = e.headers.get("Cookie") || "", s = a.split(";").find(e => e.trim().startsWith("auth="))?.split("=")[1];
                    if (!s || s !== await MD5MD5(i + h + u)) return new Response("重定向中...", {
                        status: 302,
                        headers: {
                            Location: "/login"
                        }
                    });
                    if ("admin/log.json" === w) {
                        const e = await t.KV.get("log.json") || "[]";
                        return new Response(e, {
                            status: 200,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            }
                        });
                    }
                    if ("admin/getCloudflareUsage" === r) try {
                        const e = await getCloudflareUsage(o.searchParams.get("Email"), o.searchParams.get("GlobalAPIKey"), o.searchParams.get("AccountID"), o.searchParams.get("APIToken"));
                        return new Response(JSON.stringify(e, null, 2), {
                            status: 200,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });
                    } catch (e) {
                        const t = {
                            msg: "查询请求量失败，失败原因：" + e.message,
                            error: e.message
                        };
                        return new Response(JSON.stringify(t, null, 2), {
                            status: 500,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            }
                        });
                    } else {
                        if ("admin/getADDAPI" === r) {
                            if (o.searchParams.get("url")) {
                                const e = o.searchParams.get("url");
                                try {
                                    new URL(e);
                                    const t = await 请求优选API([ e ], o.searchParams.get("port") || "443");
                                    let n = t[0].length > 0 ? t[0] : t[1];
                                    return n = n.map(e => e.replace(/#(.+)$/, (e, t) => "#" + decodeURIComponent(t))), 
                                    new Response(JSON.stringify({
                                        success: !0,
                                        data: n
                                    }, null, 2), {
                                        status: 200,
                                        headers: {
                                            "Content-Type": "application/json;charset=utf-8"
                                        }
                                    });
                                } catch (e) {
                                    const t = {
                                        msg: "验证优选API失败，失败原因：" + e.message,
                                        error: e.message
                                    };
                                    return new Response(JSON.stringify(t, null, 2), {
                                        status: 500,
                                        headers: {
                                            "Content-Type": "application/json;charset=utf-8"
                                        }
                                    });
                                }
                            }
                            return new Response(JSON.stringify({
                                success: !1,
                                data: []
                            }, null, 2), {
                                status: 403,
                                headers: {
                                    "Content-Type": "application/json;charset=utf-8"
                                }
                            });
                        }
                        if ("admin/check" === w) {
                            const t = [ "socks5", "http", "https", "turn", "sstp" ].find(e => o.searchParams.has(e)) || null;
                            if (!t) return new Response(JSON.stringify({
                                error: "缺少代理参数"
                            }), {
                                status: 400,
                                headers: {
                                    "Content-Type": "application/json;charset=utf-8"
                                }
                            });
                            const n = o.searchParams.get(t), r = Date.now();
                            let a;
                            try {
                                const s = await 获取SOCKS5账号(n, 获取代理默认端口(t)), {username: o, password: i, hostname: c, port: l} = s, u = o && i ? `${o}:${i}@${c}:${l}` : `${c}:${l}`;
                                try {
                                    const n = "cloudflare.com", o = 443, i = new TextEncoder, l = new TextDecoder, h = 创建请求TCP连接器(e);
                                    let f = null, d = null;
                                    try {
                                        if (f = "socks5" === t ? await socks5Connect(n, o, new Uint8Array(0), h, s) : "turn" === t ? await turnConnect(s, n, o, h) : "sstp" === t ? await sstpConnect(s, n, o, h) : "https" === t && isIPHostname(c) ? await httpsConnect(n, o, new Uint8Array(0), h, s) : await httpConnect(n, o, new Uint8Array(0), "https" === t, h, s), 
                                        !f) throw new Error("无法连接到代理服务器");
                                        d = new TlsClient(f, {
                                            serverName: n,
                                            insecure: !0
                                        }), await d.handshake(), await d.write(i.encode(`GET /cdn-cgi/trace HTTP/1.1\r\nHost: ${n}\r\nUser-Agent: Mozilla/5.0\r\nConnection: close\r\n\r\n`));
                                        let e = new Uint8Array(0), g = -1, y = null, p = !1;
                                        const w = 65536;
                                        for (;e.length < w; ) {
                                            const t = await d.read();
                                            if (!t) break;
                                            if (0 !== t.byteLength) {
                                                if (e = 拼接字节数据(e, t), -1 === g) {
                                                    const t = e.findIndex((t, n) => n < e.length - 3 && 13 === e[n] && 10 === e[n + 1] && 13 === e[n + 2] && 10 === e[n + 3]);
                                                    if (-1 !== t) {
                                                        g = t + 4;
                                                        const n = l.decode(e.slice(0, g)), r = n.split("\r\n")[0] || "", a = r.match(/HTTP\/\d\.\d\s+(\d+)/), s = a ? parseInt(a[1], 10) : NaN;
                                                        if (!Number.isFinite(s) || s < 200 || s >= 300) throw new Error(`代理检测请求失败: ${r || "无效响应"}`);
                                                        const o = n.match(/\r\nContent-Length:\s*(\d+)/i);
                                                        o && (y = parseInt(o[1], 10)), p = /\r\nTransfer-Encoding:\s*chunked/i.test(n);
                                                    }
                                                }
                                                if (-1 !== g && null !== y && e.length >= g + y) break;
                                                if (-1 !== g && p && l.decode(e).includes("\r\n0\r\n\r\n")) break;
                                            }
                                        }
                                        if (-1 === g) throw new Error("代理检测响应头过长或无效");
                                        const S = l.decode(e), m = S.match(/(?:^|\n)ip=(.*)/)?.[1], T = S.match(/(?:^|\n)loc=(.*)/)?.[1];
                                        if (!m || !T) throw new Error("代理检测响应无效");
                                        a = {
                                            success: !0,
                                            proxy: t + "://" + u,
                                            ip: m,
                                            loc: T,
                                            responseTime: Date.now() - r
                                        };
                                    } finally {
                                        try {
                                            d ? d.close() : await (f?.close?.());
                                        } catch (e) {}
                                    }
                                } catch (e) {
                                    a = {
                                        success: !1,
                                        error: e.message,
                                        proxy: t + "://" + u,
                                        responseTime: Date.now() - r
                                    };
                                }
                            } catch (e) {
                                a = {
                                    success: !1,
                                    error: e.message,
                                    proxy: t + "://" + n,
                                    responseTime: Date.now() - r
                                };
                            }
                            return new Response(JSON.stringify(a, null, 2), {
                                status: 200,
                                headers: {
                                    "Content-Type": "application/json;charset=utf-8"
                                }
                            });
                        }
                    }
                    if (config_JSON = await 读取config_JSON(t, p, y, i), "admin/init" === w) try {
                        return config_JSON = await 读取config_JSON(t, p, y, i, !0), n.waitUntil(请求日志记录(t, e, T, "Init_Config", config_JSON)), 
                        config_JSON.init = "配置已重置为默认值", new Response(JSON.stringify(config_JSON, null, 2), {
                            status: 200,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            }
                        });
                    } catch (e) {
                        const t = {
                            msg: "配置重置失败，失败原因：" + e.message,
                            error: e.message
                        };
                        return new Response(JSON.stringify(t, null, 2), {
                            status: 500,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            }
                        });
                    } else if ("POST" === e.method) if ("admin/config.json" === w) try {
                        const r = await e.json();
                        return r.UUID && r.HOST ? (await t.KV.put("config.json", JSON.stringify(r, null, 2)), 
                        n.waitUntil(请求日志记录(t, e, T, "Save_Config", config_JSON)), new Response(JSON.stringify({
                            success: !0,
                            message: "配置已保存"
                        }), {
                            status: 200,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            }
                        })) : new Response(JSON.stringify({
                            error: "配置不完整"
                        }), {
                            status: 400,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            }
                        });
                    } catch (e) {
                        return console.error("保存配置失败:", e), new Response(JSON.stringify({
                            error: "保存配置失败: " + e.message
                        }), {
                            status: 500,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            }
                        });
                    } else if ("admin/cf.json" === w) try {
                        const r = await e.json(), a = {
                            Email: null,
                            GlobalAPIKey: null,
                            AccountID: null,
                            APIToken: null,
                            UsageAPI: null
                        };
                        if (!r.init || !0 !== r.init) if (r.Email && r.GlobalAPIKey) a.Email = r.Email, 
                        a.GlobalAPIKey = r.GlobalAPIKey; else if (r.AccountID && r.APIToken) a.AccountID = r.AccountID, 
                        a.APIToken = r.APIToken; else {
                            if (!r.UsageAPI) return new Response(JSON.stringify({
                                error: "配置不完整"
                            }), {
                                status: 400,
                                headers: {
                                    "Content-Type": "application/json;charset=utf-8"
                                }
                            });
                            a.UsageAPI = r.UsageAPI;
                        }
                        return await t.KV.put("cf.json", JSON.stringify(a, null, 2)), n.waitUntil(请求日志记录(t, e, T, "Save_Config", config_JSON)), 
                        new Response(JSON.stringify({
                            success: !0,
                            message: "配置已保存"
                        }), {
                            status: 200,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            }
                        });
                    } catch (e) {
                        return console.error("保存配置失败:", e), new Response(JSON.stringify({
                            error: "保存配置失败: " + e.message
                        }), {
                            status: 500,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            }
                        });
                    } else if ("admin/tg.json" === w) try {
                        const r = await e.json();
                        if (r.init && !0 === r.init) {
                            const e = {
                                BotToken: null,
                                ChatID: null
                            };
                            await t.KV.put("tg.json", JSON.stringify(e, null, 2));
                        } else {
                            if (!r.BotToken || !r.ChatID) return new Response(JSON.stringify({
                                error: "配置不完整"
                            }), {
                                status: 400,
                                headers: {
                                    "Content-Type": "application/json;charset=utf-8"
                                }
                            });
                            await t.KV.put("tg.json", JSON.stringify(r, null, 2));
                        }
                        return n.waitUntil(请求日志记录(t, e, T, "Save_Config", config_JSON)), new Response(JSON.stringify({
                            success: !0,
                            message: "配置已保存"
                        }), {
                            status: 200,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            }
                        });
                    } catch (e) {
                        return console.error("保存配置失败:", e), new Response(JSON.stringify({
                            error: "保存配置失败: " + e.message
                        }), {
                            status: 500,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            }
                        });
                    } else {
                        if ("admin/ADD.txt" !== r) return new Response(JSON.stringify({
                            error: "不支持的POST请求路径"
                        }), {
                            status: 404,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            }
                        });
                        try {
                            const r = await e.text();
                            return await t.KV.put("ADD.txt", r), n.waitUntil(请求日志记录(t, e, T, "Save_Custom_IPs", config_JSON)), 
                            new Response(JSON.stringify({
                                success: !0,
                                message: "自定义IP已保存"
                            }), {
                                status: 200,
                                headers: {
                                    "Content-Type": "application/json;charset=utf-8"
                                }
                            });
                        } catch (e) {
                            return console.error("保存自定义IP失败:", e), new Response(JSON.stringify({
                                error: "保存自定义IP失败: " + e.message
                            }), {
                                status: 500,
                                headers: {
                                    "Content-Type": "application/json;charset=utf-8"
                                }
                            });
                        }
                    } else {
                        if ("admin/config.json" === w) return new Response(JSON.stringify(config_JSON, null, 2), {
                            status: 200,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });
                        if ("admin/ADD.txt" === r) {
                            let n = await t.KV.get("ADD.txt") || "null";
                            return "null" == n && (n = (await 生成随机IP(e, config_JSON.优选订阅生成.本地IP库.随机数量, config_JSON.优选订阅生成.本地IP库.指定端口))[1]), 
                            new Response(n, {
                                status: 200,
                                headers: {
                                    "Content-Type": "text/plain;charset=utf-8",
                                    asn: e.cf.asn
                                }
                            });
                        }
                        if ("admin/cf.json" === w) return new Response(JSON.stringify(e.cf, null, 2), {
                            status: 200,
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            }
                        });
                    }
                    return n.waitUntil(请求日志记录(t, e, T, "Admin_Login", config_JSON)), fetch(Pages静态页面 + "/admin" + o.search);
                }
                if ("logout" === w || d.test(w)) {
                    const e = new Response("重定向中...", {
                        status: 302,
                        headers: {
                            Location: "/login"
                        }
                    });
                    return e.headers.set("Set-Cookie", "auth=; Path=/; Max-Age=0; HttpOnly"), e;
                }
                if ("sub" === w) {
                    const r = await MD5MD5(p + y), a = [ "1", "true" ].includes(t.BEST_SUB) && "example.com" === o.searchParams.get("host") && "00000000-0000-4000-8000-000000000000" === o.searchParams.get("uuid") && i.toLowerCase().includes("tunnel (https://github.com/" + 特征码字典[1] + "/edge"), s = o.searchParams.get("token"), c = s === r, l = Math.floor(Date.now() / 864e5), u = base64SecretEncode(r, y), [h, f] = await Promise.all([ MD5MD5(u + l), MD5MD5(u + (l - 1)) ]);
                    if (c || (s === h || s === f) || a) {
                        config_JSON = await 读取config_JSON(t, p, y, i), a ? n.waitUntil(请求日志记录(t, e, T, "Get_Best_SUB", config_JSON, !1)) : n.waitUntil(请求日志记录(t, e, T, "Get_SUB", config_JSON));
                        const s = i.toLowerCase(), l = {
                            "content-type": "text/plain; charset=utf-8",
                            "Profile-Update-Interval": config_JSON.优选订阅生成.SUBUpdateTime,
                            "Profile-web-page-url": o.protocol + "//" + o.host + "/admin",
                            "Cache-Control": "no-store"
                        };
                        if (config_JSON.CF.Usage.success) {
                            const e = config_JSON.CF.Usage.pages, t = config_JSON.CF.Usage.workers, n = Number.isFinite(config_JSON.CF.Usage.max) ? config_JSON.CF.Usage.max / 1e3 * 1024 : 102400;
                            l["Subscription-Userinfo"] = `upload=${e}; download=${t}; total=${n}; expire=4102329600`;
                        }
                        const u = o.searchParams.has("b64") || o.searchParams.has("base64") || e.headers.get("subconverter-request") || e.headers.get("subconverter-version") || s.includes("subconverter") || s.includes("CF-Workers-SUB".toLowerCase()) || a, f = u ? "mixed" : o.searchParams.has("target") ? o.searchParams.get("target") : o.searchParams.has("clash") || s.includes("clash") || s.includes("meta") || s.includes("mihomo") ? "clash" : o.searchParams.has("sb") || o.searchParams.has("singbox") || s.includes("singbox") || s.includes("sing-box") ? "singbox" : o.searchParams.has("surge") || s.includes("surge") ? "surge&ver=4" : o.searchParams.has("quanx") || s.includes("quantumult") ? "quanx" : o.searchParams.has("loon") || s.includes("loon") ? "loon" : "mixed";
                        s.includes("mozilla") || (l["Content-Disposition"] = `attachment; filename*=utf-8''${encodeURIComponent(config_JSON.优选订阅生成.SUBNAME)}`);
                        const d = (o.searchParams.has("surge") || s.includes("surge")) && "ss" !== config_JSON.协议类型 ? "trojan" : config_JSON.协议类型;
                        let g = "";
                        if ("mixed" === f) {
                            const n = "Shadowrocket" == config_JSON.TLS分片 ? `&fragment=${encodeURIComponent("1,40-60,30-50,tlshello")}` : "Happ" == config_JSON.TLS分片 ? `&fragment=${encodeURIComponent("3,1,tlshello")}` : "";
                            let r = [], i = "", c = [];
                            if (!o.searchParams.has("sub") && config_JSON.优选订阅生成.local) {
                                const n = config_JSON.优选订阅生成.本地IP库.随机IP ? (await 生成随机IP(e, config_JSON.优选订阅生成.本地IP库.随机数量, config_JSON.优选订阅生成.本地IP库.指定端口))[0] : await t.KV.get("ADD.txt") ? await 整理成数组(await t.KV.get("ADD.txt")) : (await 生成随机IP(e, config_JSON.优选订阅生成.本地IP库.随机数量, config_JSON.优选订阅生成.本地IP库.指定端口))[0], a = [], s = [], o = [];
                                for (const e of n) if (e.toLowerCase().startsWith("sub://")) a.push(e); else {
                                    const t = e.indexOf("#"), n = t > -1 ? e.slice(0, t) : e, r = t > -1 ? e.slice(t) : "", i = e.match(/sub\s*=\s*([^\s&#]+)/i);
                                    if (i && i[1].trim().includes(".")) {
                                        e.toLowerCase().includes("proxyip=true") ? a.push("sub://" + i[1].trim() + "?proxyip=true" + (e.includes("#") ? "#" + e.split("#")[1] : "")) : a.push("sub://" + i[1].trim() + (e.includes("#") ? "#" + e.split("#")[1] : ""));
                                    } else if (n.toLowerCase().startsWith("https://")) a.push(e); else if (n.toLowerCase().includes("://")) if (e.includes("#")) {
                                        const t = e.split("#");
                                        o.push(t[0] + "#" + encodeURIComponent(decodeURIComponent(t[1])));
                                    } else o.push(e); else n.includes("*") ? s.push(替换星号为随机字符(n) + r) : s.push(e);
                                }
                                const l = await 请求优选API(a, "443"), u = [ ...new Set(o.concat(l[1])) ];
                                i = u.length > 0 ? u.join("\n") + "\n" : "";
                                const h = l[0];
                                c = l[3] || [], r = [ ...new Set(s.concat(h)) ];
                            } else {
                                let e = o.searchParams.get("sub") || config_JSON.优选订阅生成.SUB;
                                const [t, n] = await 获取优选订阅生成器数据(e);
                                r = r.concat(t), i += n;
                            }
                            const l = config_JSON.ECH ? `&ech=${encodeURIComponent((config_JSON.ECHConfig.SNI ? config_JSON.ECHConfig.SNI + "+" : "") + config_JSON.ECHConfig.DNS)}` : "", h = s.includes("loon") || s.includes("surge"), {type: f, "路径字段名": p, "域名字段名": w} = 获取传输协议配置(config_JSON);
                            g = i + r.map(e => {
                                const t = e.match(/^(\[[\da-fA-F:]+\]|[\d.]+|[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*)(?::(\d+))?(?:#(.+))?$/);
                                let r, s, o = "443";
                                if (!t) return console.warn(`[订阅内容] 不规范的IP格式已忽略: ${e}`), null;
                                r = t[1], o = t[2] ? t[2] : "443", s = t[3] || r;
                                let i = config_JSON.完整节点路径;
                                const g = s.match(/\$(socks5|http|https|turn|sstp):\/\/([^#\s]+)/i);
                                if (g) try {
                                    const e = g[1].toLowerCase(), t = {
                                        type: e,
                                        ...获取SOCKS5账号(g[2], 获取代理默认端口(e))
                                    };
                                    i = "/video/" + (base64SecretEncode(JSON.stringify(t), y) + (config_JSON.启用0RTT ? "?ed=2560" : "")), 
                                    s = s.replace(g[0], "").trim() || r;
                                } catch (e) {
                                    console.warn(`[订阅内容] 链式代理解析失败，已忽略该指令: ${g[0]} (${e && e.message ? e.message : e})`);
                                } else if (c.length > 0) {
                                    const e = c.find(e => e.includes(r));
                                    e && (i = `${config_JSON.PATH}/proxyip=${e}`.replace(/\/\//g, "/") + (config_JSON.启用0RTT ? "?ed=2560" : ""));
                                }
                                if (h && (i = i.replace(/,/g, "%2C")), "ss" !== d || a) {
                                    const e = 获取传输路径参数值(config_JSON, i, a);
                                    return `${d}://00000000-0000-4000-8000-000000000000@${r}:${o}?security=tls&type=${f + l}&${w}=example.com&fp=${config_JSON.Fingerprint}&sni=example.com&${p}=${encodeURIComponent(e) + n}&encryption=none#${encodeURIComponent(s)}`;
                                }
                                if (!config_JSON.SS.TLS) {
                                    o = String([ 80, 2052, 2082, 2086, 2095, 8080 ][[ 443, 2053, 2083, 2087, 2096, 8443 ].indexOf(Number(o))] ?? o);
                                }
                                return i = (i.includes("?") ? i.replace("?", "?enc=" + config_JSON.SS.加密方式 + "&") : i + "?enc=" + config_JSON.SS.加密方式).replace(/([=,])/g, "\\$1"), 
                                u || (i += ";mux=0"), `${d}://${btoa(config_JSON.SS.加密方式 + ":00000000-0000-4000-8000-000000000000")}@${r}:${o}?plugin=v2${encodeURIComponent("ray-plugin;mode=websocket;host=example.com;path=" + (config_JSON.随机路径 ? 随机路径(i) : i) + (config_JSON.SS.TLS ? ";tls" : "")) + l + n}#${encodeURIComponent(s)}`;
                            }).filter(e => null !== e).join("\n");
                        } else {
                            const t = `${config_JSON.订阅转换配置.SUBAPI}/sub?target=${f}&url=${encodeURIComponent(o.protocol + "//" + o.host + "/sub?target=mixed&token=" + h + "&cnIspCode=" + 识别运营商(e) + (o.searchParams.has("sub") && "" != o.searchParams.get("sub") ? `&sub=${o.searchParams.get("sub")}` : ""))}&config=${encodeURIComponent(config_JSON.订阅转换配置.SUBCONFIG)}&emoji=${config_JSON.订阅转换配置.SUBEMOJI}&list=${config_JSON.订阅转换配置.SUBLIST}&scv=${config_JSON.跳过证书验证}&xudp=${config_JSON.订阅转换配置.XUDP}&udp=${config_JSON.订阅转换配置.UDP}&tls13=${config_JSON.订阅转换配置.TLS13}&append_type=${config_JSON.订阅转换配置.APPEND_TYPE}&sort=${config_JSON.订阅转换配置.SORT}`;
                            try {
                                const e = await fetch(t, {
                                    headers: {
                                        "User-Agent": "Subconverter for " + f + " edgetunnel (https://github.com/" + 特征码字典[1] + "/edgetunnel)"
                                    }
                                });
                                if (!e.ok) return new Response("订阅转换后端异常：" + e.statusText, {
                                    status: e.status
                                });
                                g = await e.text(), (o.searchParams.has("surge") || s.includes("surge")) && (g = Surge订阅配置文件热补丁(g, o.protocol + "//" + o.host + "/sub?token=" + r + "&surge", config_JSON));
                            } catch (e) {
                                return new Response("订阅转换后端异常：" + e.message, {
                                    status: 403
                                });
                            }
                        }
                        if (!s.includes("subconverter") && c) {
                            const e = [ ...config_JSON.HOSTS ].sort(() => Math.random() - .5);
                            let t = 0, n = null;
                            g = g.replace(/00000000-0000-4000-8000-000000000000/g, config_JSON.UUID).replace(/MDAwMDAwMDAtMDAwMC00MDAwLTgwMDAtMDAwMDAwMDAwMDAw/g, btoa(config_JSON.UUID)).replace(/example\.com/g, () => {
                                if (t % 2 == 0) {
                                    const r = e[Math.floor(t / 2) % e.length];
                                    n = 替换星号为随机字符(r);
                                }
                                return t++, n;
                            });
                        }
                        return "mixed" !== f || s.includes("mozilla") && !o.searchParams.has("b64") && !o.searchParams.has("base64") || (g = btoa(g)), 
                        "singbox" === f ? (g = await Singbox订阅配置文件热补丁(g, config_JSON), l["content-type"] = "application/json; charset=utf-8") : "clash" === f && (g = Clash订阅配置文件热补丁(g, config_JSON), 
                        l["content-type"] = "application/x-yaml; charset=utf-8"), new Response(g, {
                            status: 200,
                            headers: l
                        });
                    }
                } else if ("locations" === w) {
                    const t = e.headers.get("Cookie") || "", n = t.split(";").find(e => e.trim().startsWith("auth="))?.split("=")[1];
                    if (n && n == await MD5MD5(i + h + u)) return fetch(new Request("https://speed.cloudflare.com/locations", {
                        headers: {
                            Referer: "https://speed.cloudflare.com/"
                        }
                    }));
                } else if ("robots.txt" === w) return new Response("User-agent: *\nDisallow: /", {
                    status: 200,
                    headers: {
                        "Content-Type": "text/plain; charset=UTF-8"
                    }
                });
            } else if (!g) return fetch(Pages静态页面 + "/noKV").then(e => {
                const t = new Headers(e.headers);
                return t.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"), 
                t.set("Pragma", "no-cache"), t.set("Expires", "0"), new Response(e.body, {
                    status: 404,
                    statusText: e.statusText,
                    headers: t
                });
            });
        }
        let b = t.URL || "nginx";
        if (b && "nginx" !== b && "1101" !== b) {
            b = b.trim().replace(/\/$/, ""), b.match(/^https?:\/\//i) || (b = "https://" + b), 
            b.toLowerCase().startsWith("http://") && (b = "https://" + b.substring(7));
            try {
                const e = new URL(b);
                b = e.protocol + "//" + e.host;
            } catch (e) {
                b = "nginx";
            }
        }
        if ("1101" === b) return new Response(await html1101(o.host, T), {
            status: 200,
            headers: {
                "Content-Type": "text/html; charset=UTF-8"
            }
        });
        try {
            const t = new URL(b), n = new Headers(e.headers);
            n.set("Host", t.host), n.set("Referer", t.origin), n.set("Origin", t.origin), !n.has("User-Agent") && i && "null" !== i && n.set("User-Agent", i);
            const r = await fetch(t.origin + o.pathname + o.search, {
                method: e.method,
                headers: n,
                body: e.body,
                cf: e.cf
            }), a = r.headers.get("content-type") || "";
            if (/text|javascript|json|xml/.test(a)) {
                const e = (await r.text()).replaceAll(t.host, o.host);
                return new Response(e, {
                    status: r.status,
                    headers: {
                        ...Object.fromEntries(r.headers),
                        "Cache-Control": "no-store"
                    }
                });
            }
            return r;
        } catch (e) {}
        return new Response(await nginx(), {
            status: 200,
            headers: {
                "Content-Type": "text/html; charset=UTF-8"
            }
        });
    }
};

const HPACKHuffman码长 = [ 13, 23, 28, 28, 28, 28, 28, 28, 28, 24, 30, 28, 28, 30, 28, 28, 28, 28, 28, 28, 28, 28, 30, 28, 28, 28, 28, 28, 28, 28, 28, 28, 6, 10, 10, 12, 13, 6, 8, 11, 10, 10, 8, 11, 8, 6, 6, 6, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 8, 15, 6, 12, 10, 13, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 8, 13, 19, 13, 14, 6, 15, 5, 6, 5, 6, 5, 6, 6, 6, 5, 7, 7, 6, 6, 6, 5, 6, 7, 6, 5, 5, 6, 7, 7, 7, 7, 7, 15, 11, 14, 13, 28, 20, 22, 20, 20, 22, 22, 22, 23, 22, 23, 23, 23, 23, 23, 24, 23, 24, 24, 22, 23, 24, 23, 23, 23, 23, 21, 22, 23, 22, 23, 23, 24, 22, 21, 20, 22, 22, 23, 23, 21, 23, 22, 22, 24, 21, 22, 23, 23, 21, 21, 22, 21, 23, 22, 23, 23, 20, 22, 22, 22, 23, 22, 22, 23, 26, 26, 20, 19, 22, 23, 22, 25, 26, 26, 26, 27, 27, 26, 24, 25, 19, 21, 26, 27, 27, 26, 27, 24, 21, 21, 26, 26, 28, 27, 27, 27, 20, 24, 20, 21, 22, 21, 21, 23, 22, 22, 25, 25, 24, 24, 26, 23, 26, 27, 26, 26, 27, 27, 27, 27, 27, 28, 27, 27, 27, 27, 27, 26, 30 ];

function 获取叉HTTPPadding标识(e) {
    return {
        "头": e.slice(1, 7),
        "键": "_" + e.slice(25, 31)
    };
}

function 计算HPACKHuffman字节长度(e) {
    const t = (new TextEncoder).encode(e);
    let n = 0;
    for (let e = 0; e < t.length; e++) n += HPACKHuffman码长[t[e]];
    return Math.ceil(n / 8);
}

function 提取叉HTTPPadding值(e, t, n) {
    const r = e.headers.get(t);
    if (r) {
        try {
            const e = new URL(r, "https://x.invalid").searchParams.get(n);
            if (e) return e;
        } catch (e) {}
        return r;
    }
    return new URL(e.url).searchParams.get(n) || "";
}

function 校验叉HTTPPadding(e, t, n) {
    const r = 提取叉HTTPPadding值(e, t, n);
    if (!r) return !0;
    const a = 计算HPACKHuffman字节长度(r);
    return a >= 98 && a <= 1002;
}

const 叉HTTPBase62字符集 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function 生成叉HTTPPadding串(e) {
    let t = "";
    for (let n = 0; n < e; n++) t += 叉HTTPBase62字符集[Math.floor(62 * Math.random())];
    return t;
}

async function 处理叉HTTP请求(e, t, n = {}) {
    if (!e.body) return new Response("Bad Request", {
        status: 400
    });
    const {"头": r, "键": a} = 获取叉HTTPPadding标识(t);
    if (!校验叉HTTPPadding(e, r, a)) return new Response("Bad Request", {
        status: 400
    });
    const s = e.body.getReader(), o = await 读取叉HTTP首包(s, t);
    if (!o) {
        try {
            s.releaseLock();
        } catch (e) {}
        return new Response("Invalid request", {
            status: 400
        });
    }
    if (isSpeedTestSite(o.hostname) && null === n.代理类型) {
        try {
            s.releaseLock();
        } catch (e) {}
        return new Response(构造本地204响应(o.respHeader), {
            status: 200,
            headers: {
                "Content-Type": "application/octet-stream",
                "X-Accel-Buffering": "no",
                "Cache-Control": "no-store"
            }
        });
    }
    if (o.isUDP && "trojan" !== o.协议 && 53 !== o.port) {
        try {
            s.releaseLock();
        } catch (e) {}
        return new Response("UDP is not supported", {
            status: 400
        });
    }
    const i = new Headers({
        "Content-Type": "application/octet-stream",
        "X-Accel-Buffering": "no",
        "Cache-Control": "no-store"
    });
    try {
        const e = new URL("https://x.invalid/");
        e.searchParams.set(a, 生成叉HTTPPadding串(100 + Math.floor(901 * Math.random()))), i.set(r, e.toString());
    } catch (e) {}
    if (o.isUDP) return 处理叉HTTPUDP请求(o, s, e, n, i);
    try {
        s.releaseLock();
    } catch (e) {}
    const c = {
        socket: null,
        connectingPromise: null,
        retryConnect: null,
        downlinkDrain: Promise.resolve()
    }, l = new AbortController;
    let u = !1;
    const h = e => {
        if (!u) {
            u = !0;
            try {
                l.abort(e);
            } catch (e) {}
            失效TCP连接世代(c);
        }
    }, f = {
        readyState: WebSocket.OPEN
    };
    let d;
    try {
        d = await forwardataTCP(o.hostname, o.port, o.rawData, f, o.respHeader, c, t, e, n, "trojan" === o.协议, o.原始数据, !0);
    } catch (e) {
        return log(`[叉HTTP-Pipe] 连接失败: ${e?.message || e}`), h(e), new Response("bad gateway", {
            status: 502
        });
    }
    if (!d) return h(new Error("socket is null")), new Response("bad gateway", {
        status: 502
    });
    const g = (async () => {
        const t = 创建上行Grain合包流(), n = t.readable.pipeTo(d.writable, {
            signal: l.signal
        });
        n.catch(h);
        const r = e.body.getReader(), a = () => {
            try {
                r.cancel(l.signal.reason).catch(() => {});
            } catch (e) {}
        };
        l.signal.addEventListener("abort", a, {
            once: !0
        });
        try {
            try {
                for (;;) {
                    const {done: e, value: n} = await r.read();
                    if (e) break;
                    n?.byteLength && await t.写入(n);
                }
            } finally {
                l.signal.removeEventListener("abort", a);
                try {
                    r.releaseLock();
                } catch (e) {}
            }
        } finally {
            try {
                await t.结束();
            } catch (e) {}
        }
        await n;
    })(), y = "undefined" != typeof IdentityTransformStream ? new IdentityTransformStream : new TransformStream, p = (async () => {
        const e = y.writable.getWriter();
        try {
            有效数据长度(o.respHeader) > 0 && await e.write(o.respHeader);
        } catch (t) {
            try {
                await e.abort(t);
            } catch (e) {}
            throw t;
        } finally {
            try {
                e.releaseLock();
            } catch (e) {}
        }
        await d.readable.pipeTo(y.writable, {
            signal: l.signal
        });
    })();
    return g.catch(h), p.then(() => h(), h), Promise.allSettled([ g, p ]), new Response(y.readable, {
        status: 200,
        headers: i
    });
}

function 处理叉HTTPUDP请求(e, t, n, r, a) {
    const s = {
        "缓存": new Uint8Array(0),
        "反代地址": r.木马反代地址
    };
    return new Response(new ReadableStream({
        async start(r) {
            let a = !1, o = e.respHeader;
            const i = {
                readyState: WebSocket.OPEN,
                send(e) {
                    if (!a) try {
                        const t = e instanceof Uint8Array ? e : e instanceof ArrayBuffer ? new Uint8Array(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : new Uint8Array(e);
                        r.enqueue(t);
                    } catch (e) {
                        a = !0, this.readyState = WebSocket.CLOSED;
                    }
                },
                close() {
                    if (!a) {
                        a = !0, this.readyState = WebSocket.CLOSED;
                        try {
                            r.close();
                        } catch (e) {}
                    }
                }
            };
            let c = !1;
            try {
                for ("trojan" === e.协议 && (s.目标主机 = e.hostname, s.目标端口 = e.port, s.反代地址 && await 转发木马UDP数据(e.原始数据, i, s, n)), 
                "trojan" === e.协议 && s.反代地址 || !e.rawData?.byteLength || ("trojan" === e.协议 ? await 转发木马UDP数据(e.rawData, i, s, n) : await forwardataudp(e.rawData, i, o, n), 
                o = null); ;) {
                    const {done: r, value: a} = await t.read();
                    if (r) break;
                    a && 0 !== a.byteLength && ("trojan" === e.协议 ? await 转发木马UDP数据(a, i, s, n) : await forwardataudp(a, i, o, n), 
                    o = null);
                }
            } catch (e) {
                c = !0, log(`[叉HTTP转发] 处理失败: ${e?.message || e}`), closeSocketQuietly(i);
            } finally {
                if (!(!c && "trojan" === e.协议 && s.反代地址 && s.反代Socket)) {
                    try {
                        s.反代Socket?.close();
                    } catch (e) {}
                    closeSocketQuietly(i);
                }
                try {
                    t.releaseLock();
                } catch (e) {}
            }
        },
        cancel() {
            try {
                s.反代Socket?.close();
            } catch (e) {}
            try {
                t.releaseLock();
            } catch (e) {}
        }
    }), {
        status: 200,
        headers: a
    });
}

function 有效数据长度(e) {
    return e ? "number" == typeof e.byteLength ? e.byteLength : "number" == typeof e.length ? e.length : 0 : 0;
}

function 失效TCP连接世代(e) {
    if (!e) return;
    e.generation = (Number.isInteger(e.generation) ? e.generation : 0) + 1;
    const t = e.socket;
    e.socket = null, e.downlinkController = null, e.downlinkDrain = Promise.resolve();
    try {
        t?.close?.();
    } catch (e) {}
}

function 开始TCP连接世代(e) {
    Number.isInteger(e.generation) || (e.generation = 0);
    const t = ++e.generation, n = e.socket;
    e.socket = null;
    const r = e.downlinkController;
    e.downlinkController = null;
    const a = e.downlinkDrain || Promise.resolve();
    let s;
    try {
        s = r?.停止并刷新?.() || Promise.resolve();
    } catch (e) {
        s = Promise.reject(e);
    }
    const o = Promise.all([ a, s ]);
    o.catch(() => {}), e.downlinkDrain = o;
    try {
        n?.close?.();
    } catch (e) {}
    return {
        generation: t,
        downlinkDrain: o
    };
}

async function 读取叉HTTP首包(e, t) {
    const n = VLESS文本解码器, r = e => {
        const r = e.byteLength;
        if (r < 18) return {
            "状态": "need_more"
        };
        if (!UUID字节匹配(e, 1, t)) return {
            "状态": "invalid"
        };
        const a = 18 + e[17];
        if (r < a + 1) return {
            "状态": "need_more"
        };
        const s = e[a];
        if (1 !== s && 2 !== s) return {
            "状态": "invalid"
        };
        const o = a + 1;
        if (r < o + 3) return {
            "状态": "need_more"
        };
        const i = e[o] << 8 | e[o + 1], c = e[o + 2], l = o + 3;
        let u = -1, h = "";
        if (1 === c) {
            if (r < l + 4) return {
                "状态": "need_more"
            };
            h = `${e[l]}.${e[l + 1]}.${e[l + 2]}.${e[l + 3]}`, u = l + 4;
        } else if (2 === c) {
            if (r < l + 1) return {
                "状态": "need_more"
            };
            const t = e[l];
            if (r < l + 1 + t) return {
                "状态": "need_more"
            };
            h = n.decode(e.subarray(l + 1, l + 1 + t)), u = l + 1 + t;
        } else {
            if (3 !== c) return {
                "状态": "invalid"
            };
            {
                if (r < l + 16) return {
                    "状态": "need_more"
                };
                const t = [];
                for (let n = 0; n < 8; n++) {
                    const r = l + 2 * n;
                    t.push((e[r] << 8 | e[r + 1]).toString(16));
                }
                h = t.join(":"), u = l + 16;
            }
        }
        return h ? {
            "状态": "ok",
            "结果": {
                "协议": "vless",
                hostname: h,
                port: i,
                isUDP: 2 === s,
                rawData: e.subarray(u),
                respHeader: new Uint8Array([ e[0], 0 ]),
                "原始数据": null
            }
        } : {
            "状态": "invalid"
        };
    }, a = e => {
        const r = sha224(t), a = (new TextEncoder).encode(r), s = e.byteLength;
        if (s < 58) return {
            "状态": "need_more"
        };
        if (13 !== e[56] || 10 !== e[57]) return {
            "状态": "invalid"
        };
        for (let t = 0; t < 56; t++) if (e[t] !== a[t]) return {
            "状态": "invalid"
        };
        if (s < 60) return {
            "状态": "need_more"
        };
        const o = e[58];
        if (1 !== o && 3 !== o) return {
            "状态": "invalid"
        };
        const i = 3 === o, c = e[59];
        let l = 60, u = "";
        if (1 === c) {
            if (s < l + 4) return {
                "状态": "need_more"
            };
            u = `${e[l]}.${e[l + 1]}.${e[l + 2]}.${e[l + 3]}`, l += 4;
        } else if (3 === c) {
            if (s < l + 1) return {
                "状态": "need_more"
            };
            const t = e[l];
            if (s < l + 1 + t) return {
                "状态": "need_more"
            };
            u = n.decode(e.subarray(l + 1, l + 1 + t)), l += 1 + t;
        } else {
            if (4 !== c) return {
                "状态": "invalid"
            };
            {
                if (s < l + 16) return {
                    "状态": "need_more"
                };
                const t = [];
                for (let n = 0; n < 8; n++) {
                    const r = l + 2 * n;
                    t.push((e[r] << 8 | e[r + 1]).toString(16));
                }
                u = t.join(":"), l += 16;
            }
        }
        if (!u) return {
            "状态": "invalid"
        };
        if (s < l + 4) return {
            "状态": "need_more"
        };
        const h = e[l] << 8 | e[l + 1];
        if (13 !== e[l + 2] || 10 !== e[l + 3]) return {
            "状态": "invalid"
        };
        const f = l + 4;
        return {
            "状态": "ok",
            "结果": {
                "协议": "trojan",
                hostname: u,
                port: h,
                isUDP: i,
                rawData: e.subarray(f),
                "原始数据": e,
                respHeader: null
            }
        };
    };
    let s = new Uint8Array(1024), o = 0;
    for (;;) {
        const {value: t, done: n} = await e.read();
        if (n) {
            if (0 === o) return null;
            break;
        }
        const i = t instanceof Uint8Array ? t : new Uint8Array(t);
        if (o + i.byteLength > s.byteLength) {
            const e = new Uint8Array(Math.max(2 * s.byteLength, o + i.byteLength));
            e.set(s.subarray(0, o)), s = e;
        }
        s.set(i, o), o += i.byteLength;
        const c = s.subarray(0, o), l = a(c);
        if ("ok" === l.状态) return {
            ...l.结果,
            reader: e
        };
        const u = r(c);
        if ("ok" === u.状态) return {
            ...u.结果,
            reader: e
        };
        if ("invalid" === l.状态 && "invalid" === u.状态) return null;
    }
    const i = s.subarray(0, o), c = a(i);
    if ("ok" === c.状态) return {
        ...c.结果,
        reader: e
    };
    const l = r(i);
    return "ok" === l.状态 ? {
        ...l.结果,
        reader: e
    } : null;
}

async function 处理gRPC请求(e, t, n = {}) {
    if (!e.body) return new Response("Bad Request", {
        status: 400
    });
    const r = e.body.getReader(), a = {
        socket: null,
        connectingPromise: null,
        retryConnect: null,
        downlinkDrain: Promise.resolve()
    }, s = () => 失效TCP连接世代(a);
    let o = !1;
    const i = {
        "缓存": new Uint8Array(0),
        "反代地址": n.木马反代地址
    };
    let c = null, l = null, u = null, h = null;
    const f = new Headers({
        "Content-Type": "application/grpc",
        "grpc-status": "0",
        "X-Accel-Buffering": "no",
        "Cache-Control": "no-store"
    });
    return new Response(new ReadableStream({
        async start(f) {
            let d = !1, g = [], y = 0, p = null, w = !1;
            const S = {
                readyState: WebSocket.OPEN,
                send(e) {
                    if (d) return;
                    const t = e instanceof Uint8Array ? e : new Uint8Array(e), n = [];
                    let r = t.byteLength >>> 0;
                    for (;r > 127; ) n.push(127 & r | 128), r >>>= 7;
                    n.push(r);
                    const a = new Uint8Array(n), s = 1 + a.length + t.byteLength, o = new Uint8Array(5 + s);
                    o[0] = 0, o[1] = s >>> 24 & 255, o[2] = s >>> 16 & 255, o[3] = s >>> 8 & 255, o[4] = 255 & s, 
                    o[5] = 10, o.set(a, 6), o.set(t, 6 + a.length), g.push(o), y += o.byteLength, T();
                },
                close() {
                    if (this.readyState !== WebSocket.CLOSED) {
                        m(!0), d = !0, this.readyState = WebSocket.CLOSED;
                        try {
                            f.close();
                        } catch (e) {}
                    }
                }
            }, m = (e = !1) => {
                if (w = !1, p && (clearTimeout(p), p = null), !e && d || 0 === y) return;
                const t = new Uint8Array(y);
                let n = 0;
                for (const e of g) t.set(e, n), n += e.byteLength;
                g = [], y = 0;
                try {
                    f.enqueue(t);
                } catch (e) {
                    d = !0, S.readyState = WebSocket.CLOSED;
                }
            }, T = () => {
                y >= 32768 ? m() : w || p || (w = !0, queueMicrotask(() => {
                    w = !1, d || 0 === y || p || (p = setTimeout(m, 1));
                }));
            }, b = () => {
                if (!d) {
                    if (h?.清空(), s(), m(!0), d = !0, S.readyState = WebSocket.CLOSED, p && clearTimeout(p), 
                    u) {
                        try {
                            u.releaseLock();
                        } catch (e) {}
                        u = null;
                    }
                    l = null;
                    try {
                        r.releaseLock();
                    } catch (e) {}
                    try {
                        i.反代Socket?.close();
                    } catch (e) {}
                    try {
                        f.close();
                    } catch (e) {}
                }
            }, C = () => {
                if (u) {
                    try {
                        u.releaseLock();
                    } catch (e) {}
                    u = null;
                }
                l = null;
            }, A = h = 创建上行写入队列({
                "获取写入器": () => {
                    const e = a.socket;
                    return e ? (e !== l && (C(), l = e, u = e.writable.getWriter()), u) : null;
                },
                "获取连接任务": () => a.connectingPromise,
                "释放写入器": C,
                "重试连接": async () => {
                    if ("function" != typeof a.retryConnect) throw new Error("retry unavailable");
                    await a.retryConnect();
                },
                "关闭连接": b,
                "名称": "gRPC上行"
            }), E = async (e, t = !0) => A.写入并等待(e, t);
            let U = !1;
            try {
                let s = new Uint8Array(0);
                for (;;) {
                    const {done: l, value: u} = await r.read();
                    if (l) break;
                    if (!u || 0 === u.byteLength) continue;
                    const h = u instanceof Uint8Array ? u : new Uint8Array(u), f = new Uint8Array(s.length + h.length);
                    for (f.set(s, 0), f.set(h, s.length), s = f; s.byteLength >= 5; ) {
                        const r = 5 + (s[1] << 24 >>> 0 | s[2] << 16 | s[3] << 8 | s[4]);
                        if (s.byteLength < r) break;
                        const l = s.subarray(5, r);
                        if (s = s.slice(r), !l.byteLength) continue;
                        let u = l;
                        if (u.byteLength >= 2 && 10 === u[0]) {
                            let e = 0, t = 1, n = !1;
                            for (;t < u.length; ) {
                                if (!(128 & u[t++])) {
                                    n = !0;
                                    break;
                                }
                                if (e += 7, e > 35) break;
                            }
                            n && (u = u.subarray(t));
                        }
                        if (u.byteLength) if (o) c ? await 转发木马UDP数据(u, S, i, e) : await forwardataudp(u, S, null, e); else if (a.socket || a.connectingPromise) {
                            if (!await E(u)) throw new Error("Remote socket is not ready");
                        } else {
                            const r = 数据转Uint8Array(u);
                            if (null === c && (c = r.byteLength >= 58 && 13 === r[56] && 10 === r[57]), c) {
                                const s = 解析木马请求(r, t);
                                if (s?.hasError) throw new Error(s.message || "Invalid trojan request");
                                const {port: c, hostname: l, rawClientData: u, isUDP: h} = s;
                                if (log(`[gRPC] 木马首包: ${l}:${c} | UDP: ${h ? "是" : "否"}`), isSpeedTestSite(l) && null === n.代理类型) return void S.send(构造本地204响应());
                                h ? (o = !0, i.目标主机 = l, i.目标端口 = c, i.反代地址 ? await 转发木马UDP数据(r, S, i, e) : 有效数据长度(u) > 0 && await 转发木马UDP数据(u, S, i, e)) : await forwardataTCP(l, c, u, S, null, a, t, e, n, !0, r);
                            } else {
                                c = !1;
                                const s = 解析魏烈思请求(r, t);
                                if (s?.hasError) throw new Error(s.message || "Invalid 魏烈思 request");
                                const {port: l, hostname: u, version: h, isUDP: f, rawClientData: d} = s;
                                log(`[gRPC] 魏烈思首包: ${u}:${l} | UDP: ${f ? "是" : "否"}`);
                                const g = new Uint8Array([ h, 0 ]);
                                if (isSpeedTestSite(u) && null === n.代理类型) return void S.send(构造本地204响应(g));
                                if (f) {
                                    if (53 !== l) throw new Error("UDP is not supported");
                                    o = !0;
                                }
                                S.send(g);
                                const y = d;
                                o ? c ? await 转发木马UDP数据(y, S, i, e) : await forwardataudp(y, S, null, e) : await forwardataTCP(u, l, y, S, null, a, t, e, n);
                            }
                        }
                    }
                    m();
                }
                await A.等待空();
            } catch (e) {
                U = !0, log(`[gRPC转发] 处理失败: ${e?.message || e}`);
            } finally {
                if (!U && o && c && i.反代地址 && i.反代Socket) {
                    A.清空(), s(), C();
                    try {
                        r.releaseLock();
                    } catch (e) {}
                } else b();
            }
        },
        cancel() {
            h?.清空(), s();
            try {
                i.反代Socket?.close();
            } catch (e) {}
            try {
                r.releaseLock();
            } catch (e) {}
        }
    }), {
        status: 200,
        headers: f
    });
}

function 是有效WS早期数据(e, t) {
    if (!e?.byteLength) return !1;
    if (e.byteLength >= 18 && UUID字节匹配(e, 1, t)) return !0;
    if (e.byteLength < 58 || 13 !== e[56] || 10 !== e[57]) return !1;
    const n = sha224(t);
    for (let t = 0; t < 56; t++) if (e[t] !== n.charCodeAt(t)) return !1;
    return !0;
}

function 解码WS早期数据(e, t) {
    if (!e) return null;
    if (e.length > WS早期数据最大头长度) throw new Error("early data is too large");
    let n;
    const r = Uint8Array;
    if ("function" == typeof r.fromBase64) try {
        n = r.fromBase64(e, {
            alphabet: "base64url"
        });
    } catch (e) {}
    if (!n) {
        let t = e.replace(/-/g, "+").replace(/_/g, "/");
        const r = t.length % 4;
        let a;
        r && (t += "=".repeat(4 - r));
        try {
            a = atob(t);
        } catch (e) {
            return null;
        }
        n = new Uint8Array(a.length);
        for (let e = 0; e < a.length; e++) n[e] = a.charCodeAt(e);
    }
    if (n.byteLength > 8192) throw new Error("early data is too large");
    return 是有效WS早期数据(n, t) ? n : null;
}

async function 处理WS请求(e, t, n, r = {}) {
    const a = new WebSocketPair, [s, o] = Object.values(a);
    try {
        o.accept({
            allowHalfOpen: !0
        });
    } catch (e) {
        o.accept();
    }
    o.binaryType = "arraybuffer";
    let i = {
        socket: null,
        connectingPromise: null,
        retryConnect: null,
        downlinkDrain: Promise.resolve()
    };
    const c = () => 失效TCP连接世代(i);
    let l = !1, u = null;
    const h = {
        "缓存": new Uint8Array(0),
        "反代地址": r.木马反代地址
    }, f = e.headers.get("sec-websocket-protocol") || "", d = !!n.searchParams.get("enc");
    let g = null, y = Promise.resolve(), p = !1, w = !1, S = !1, m = 0, T = 0, b = null, C = null, A = null, E = null, U = null, P = !1, N = null, _ = new Uint8Array(0), k = null;
    const L = async () => {
        if (!N) return;
        const e = k;
        k = null, await WebSocket发送并等待(N, 构造WS本地204响应(e));
    }, O = e => {
        for (let t = 0; t <= e.byteLength - 4; t++) if (13 === e[t] && 10 === e[t + 1] && 13 === e[t + 2] && 10 === e[t + 3]) return t + 4;
        return -1;
    }, $ = async e => {
        const t = 数据转Uint8Array(e);
        if (t.byteLength) {
            if (_.byteLength + t.byteLength > 65536) throw new Error("WS local speed-test request is too large");
            for (_ = 拼接字节数据(_, t); _.byteLength; ) {
                const e = O(_);
                if (-1 === e) return;
                const t = VLESS文本解码器.decode(_.subarray(0, e)).match(/(?:^|\r\n)content-length\s*:\s*(\d+)/i), n = t ? Number(t[1]) : 0, r = e + n;
                if (!Number.isSafeInteger(n) || r > 65536) throw new Error("WS local speed-test request body is too large");
                if (_.byteLength < r) return;
                _ = _.slice(r), await L();
            }
        }
    }, I = async (e, t = null, n = null) => {
        P = !0, N = e, _ = new Uint8Array(0), k = t, 有效数据长度(n) > 0 && await $(n);
    }, v = () => {
        if (A) {
            try {
                A.releaseLock();
            } catch (e) {}
            A = null;
        }
        C = null;
    }, R = g = 创建上行写入队列({
        "获取写入器": () => {
            const e = i.socket;
            return e ? (e !== C && (v(), C = e, A = e.writable.getWriter()), A) : null;
        },
        "获取连接任务": () => i.connectingPromise,
        "释放写入器": v,
        "重试连接": async () => {
            if ("function" != typeof i.retryConnect) throw new Error("retry unavailable");
            await i.retryConnect();
        },
        "关闭连接": e => M(e),
        "名称": "WS上行"
    }), D = async (e, t = !0) => R.写入(e, t), x = async () => E || (U || (U = (async () => {
        const e = (n.searchParams.get("enc") || "").toLowerCase(), r = SS支持加密配置[e] || SS支持加密配置["aes-128-gcm"], a = [ r, ...Object.values(SS支持加密配置).filter(e => e.method !== r.method) ], s = new Map, i = e => (s.has(e.method) || s.set(e.method, SS派生主密钥(t, e.keyLen)), 
        s.get(e.method)), c = {
            buffer: new Uint8Array(0),
            hasSalt: !1,
            waitPayloadLength: null,
            decryptKey: null,
            nonceCounter: new Uint8Array(SSNonce长度),
            "加密配置": null
        }, l = {
            async "输入"(t) {
                const n = 数据转Uint8Array(t);
                if (n.byteLength > 0 && (c.buffer = 拼接字节数据(c.buffer, n)), !c.hasSalt) {
                    if (!await (async () => {
                        const t = 2 + SSAEAD标签长度, n = Math.max(...a.map(e => e.saltLen)), s = Math.min(16, Math.max(0, c.buffer.byteLength - (t + Math.min(...a.map(e => e.saltLen)))));
                        for (let n = 0; n <= s; n++) for (const s of a) {
                            const a = n + s.saltLen + t;
                            if (c.buffer.byteLength < a) continue;
                            const o = c.buffer.subarray(n, n + s.saltLen), l = c.buffer.subarray(n + s.saltLen, a), u = await i(s), h = await SS派生会话密钥(s, u, o, [ "decrypt" ]), f = new Uint8Array(SSNonce长度);
                            try {
                                const t = await SSAEAD解密(h, f, l);
                                if (2 !== t.byteLength) continue;
                                const o = t[0] << 8 | t[1];
                                if (o < 0 || o > s.maxChunk) continue;
                                return n > 0 && log(`[SS入站] 检测到前导噪声 ${n}B，已自动对齐`), s.method !== r.method && log(`[SS入站] URL enc=${e || r.method} 与实际 ${s.method} 不一致，已自动切换`), 
                                c.buffer = c.buffer.subarray(a), c.decryptKey = h, c.nonceCounter = f, c.waitPayloadLength = o, 
                                c.加密配置 = s, c.hasSalt = !0, !0;
                            } catch (e) {}
                        }
                        const o = n + t + 16;
                        if (c.buffer.byteLength >= o) throw new Error(`SS handshake decrypt failed (enc=${e || "auto"}, candidates=${a.map(e => e.method).join("/")})`);
                        return !1;
                    })()) return [];
                }
                const s = [];
                for (;;) {
                    if (null === c.waitPayloadLength) {
                        const e = 2 + SSAEAD标签长度;
                        if (c.buffer.byteLength < e) break;
                        const t = c.buffer.subarray(0, e);
                        c.buffer = c.buffer.subarray(e);
                        const n = await SSAEAD解密(c.decryptKey, c.nonceCounter, t);
                        if (2 !== n.byteLength) throw new Error("SS length decrypt failed");
                        const r = n[0] << 8 | n[1];
                        if (r < 0 || r > c.加密配置.maxChunk) throw new Error(`SS payload length invalid: ${r}`);
                        c.waitPayloadLength = r;
                    }
                    const e = c.waitPayloadLength + SSAEAD标签长度;
                    if (c.buffer.byteLength < e) break;
                    const t = c.buffer.subarray(0, e);
                    c.buffer = c.buffer.subarray(e);
                    const n = await SSAEAD解密(c.decryptKey, c.nonceCounter, t);
                    s.push(n), c.waitPayloadLength = null;
                }
                return s;
            }
        };
        let u = null;
        const h = 32768;
        let f = Promise.resolve();
        const d = e => (f = f.then(async () => {
            if (o.readyState !== WebSocket.OPEN) return;
            const n = await (async () => {
                if (u) return u;
                if (!c.加密配置) throw new Error("SS cipher is not negotiated");
                const e = c.加密配置, n = await SS派生主密钥(t, e.keyLen), r = crypto.getRandomValues(new Uint8Array(e.saltLen)), a = await SS派生会话密钥(e, n, r, [ "encrypt" ]), s = new Uint8Array(SSNonce长度);
                let o = !1;
                return u = {
                    async "加密并发送"(t, n) {
                        const i = 数据转Uint8Array(t);
                        if (o || (await n(r), o = !0), 0 === i.byteLength) return;
                        let c = 0;
                        for (;c < i.byteLength; ) {
                            const t = Math.min(c + e.maxChunk, i.byteLength), r = i.subarray(c, t), o = new Uint8Array(2);
                            o[0] = r.byteLength >>> 8 & 255, o[1] = 255 & r.byteLength;
                            const l = await SSAEAD加密(a, s, o), u = await SSAEAD加密(a, s, r), h = new Uint8Array(l.byteLength + u.byteLength);
                            h.set(l, 0), h.set(u, l.byteLength), await n(h), c = t;
                        }
                    }
                }, u;
            })();
            await n.加密并发送(e, async e => {
                e.byteLength > 0 && o.readyState === WebSocket.OPEN && await WebSocket发送并等待(o, e.buffer);
            });
        }).catch(e => {
            log(`[SS发送] 加密失败: ${e?.message || e}`), closeSocketQuietly(o);
        }), f);
        return E = {
            "入站解密器": l,
            "回包Socket": {
                get readyState() {
                    return o.readyState;
                },
                send(e) {
                    const t = 数据转Uint8Array(e);
                    if (t.byteLength <= h) return d(t);
                    for (let e = 0; e < t.byteLength; e += h) d(t.subarray(e, Math.min(e + h, t.byteLength)));
                    return f;
                },
                close() {
                    closeSocketQuietly(o);
                }
            },
            "首包已建立": !1,
            "目标主机": "",
            "目标端口": 0
        }, E;
    })().finally(() => {
        U = null;
    })), U), H = async n => {
        const a = await x();
        let s = null;
        try {
            s = await a.入站解密器.输入(n);
        } catch (e) {
            const t = e?.message || `${e}`;
            if (t.includes("Decryption failed") || t.includes("SS handshake decrypt failed") || t.includes("SS length decrypt failed")) return log(`[SS入站] 解密失败，连接关闭: ${t}`), 
            void closeSocketQuietly(o);
            throw e;
        }
        for (const n of s) {
            if (P) {
                await $(n);
                continue;
            }
            let s = !1;
            try {
                s = await D(n, !1);
            } catch (e) {
                if (e?.isQueueOverflow) throw e;
                s = !1;
            }
            if (s) continue;
            if (a.首包已建立 && a.目标主机 && a.目标端口 > 0) {
                await forwardataTCP(a.目标主机, a.目标端口, n, a.回包Socket, null, i, t, e, r);
                continue;
            }
            const o = 数据转Uint8Array(n);
            if (o.byteLength < 3) throw new Error("invalid ss data");
            const c = o[0];
            let l = 1, u = "";
            if (1 === c) {
                if (o.byteLength < l + 4 + 2) throw new Error("invalid ss ipv4 length");
                u = `${o[l]}.${o[l + 1]}.${o[l + 2]}.${o[l + 3]}`, l += 4;
            } else if (3 === c) {
                if (o.byteLength < l + 1) throw new Error("invalid ss domain length");
                const e = o[l];
                if (l += 1, o.byteLength < l + e + 2) throw new Error("invalid ss domain data");
                u = SS文本解码器.decode(o.subarray(l, l + e)), l += e;
            } else {
                if (4 !== c) throw new Error(`invalid ss addressType: ${c}`);
                {
                    if (o.byteLength < l + 16 + 2) throw new Error("invalid ss ipv6 length");
                    const e = [], t = new DataView(o.buffer, o.byteOffset + l, 16);
                    for (let n = 0; n < 8; n++) e.push(t.getUint16(2 * n).toString(16));
                    u = e.join(":"), l += 16;
                }
            }
            if (!u) throw new Error(`invalid ss address: ${c}`);
            const h = o[l] << 8 | o[l + 1];
            l += 2;
            const f = o.subarray(l);
            if (isSpeedTestSite(u) && null === r.代理类型) return void await I(a.回包Socket, null, f);
            a.首包已建立 = !0, a.目标主机 = u, a.目标端口 = h, await forwardataTCP(u, h, f, a.回包Socket, null, i, t, e, r);
        }
    }, M = e => {
        if (w) return;
        w = !0, p = !0, m = 0, T = 0;
        const t = e?.message || `${e}`;
        t.includes("Network connection lost") || t.includes("ReadableStream is closed") ? log(`[WS转发] 连接结束: ${t}`) : log(`[WS转发] 处理失败: ${t}`), 
        R.清空(), v(), c();
        try {
            h.反代Socket?.close();
        } catch (e) {}
        closeSocketQuietly(o);
    }, K = e => (y = y.then(e).catch(M), y), J = a => {
        if (p || w) return;
        const s = Math.max(0, 有效数据长度(a)), c = m + s, f = T + 1;
        c > 16777216 || f > 4096 ? M(new Error(`[WS显式传输] 队列溢出: ${c}B/${f}`)) : (m = c, T = f, 
        K(async () => {
            m = Math.max(0, m - s), T = Math.max(0, T - 1), w || await (async a => {
                let s = null;
                if (l) return u ? await 转发木马UDP数据(a, o, h, e) : await forwardataudp(a, o, null, e);
                if ("ss" !== b) {
                    if (P) await $(a); else if (!await D(a)) {
                        if (null === b) {
                            if (n.searchParams.get("enc")) b = "ss"; else {
                                s = s || 数据转Uint8Array(a);
                                const e = s;
                                b = e.byteLength >= 58 && 13 === e[56] && 10 === e[57] ? "木马" : "魏烈思";
                            }
                            u = "木马" === b, log(`[WS转发] 协议类型: ${b} | 来自: ${n.host} | UA: ${e.headers.get("user-agent") || "未知"}`);
                        }
                        if ("ss" !== b) {
                            if (!await D(a)) if ("木马" === b) {
                                const n = 解析木马请求(a, t);
                                if (n?.hasError) throw new Error(n.message || "Invalid trojan request");
                                const {port: c, hostname: u, rawClientData: f, isUDP: d} = n;
                                if (isSpeedTestSite(u) && null === r.代理类型) return void await I(o, null, f);
                                if (d) return l = !0, h.目标主机 = u, h.目标端口 = c, h.反代地址 ? 转发木马UDP数据(s || 数据转Uint8Array(a), o, h, e) : 有效数据长度(f) > 0 ? 转发木马UDP数据(f, o, h, e) : void 0;
                                await forwardataTCP(u, c, f, o, null, i, t, e, r, !0, s || 数据转Uint8Array(a));
                            } else {
                                u = !1, s = s || 数据转Uint8Array(a);
                                const n = 解析魏烈思请求(s, t);
                                if (n?.hasError) throw new Error(n.message || "Invalid 魏烈思 request");
                                const {port: c, hostname: f, version: d, isUDP: g, rawClientData: y} = n, p = new Uint8Array([ d, 0 ]);
                                if (isSpeedTestSite(f) && null === r.代理类型) return void await I(o, p, y);
                                if (g) {
                                    if (53 !== c) throw new Error("UDP is not supported");
                                    l = !0;
                                }
                                const w = y;
                                if (l) return u ? 转发木马UDP数据(w, o, h, e) : forwardataudp(w, o, p, e);
                                await forwardataTCP(f, c, w, o, p, i, t, e, r);
                            }
                        } else await H(a);
                    }
                } else await H(a);
            })(a);
        }));
    };
    if (o.addEventListener("message", e => {
        J(e.data);
    }), o.addEventListener("close", () => {
        closeSocketQuietly(o), S || (S = !0, p = !0, K(async () => {
            if (!w) {
                await R.等待空(), v(), c();
                try {
                    h.反代Socket?.close();
                } catch (e) {}
            }
        }));
    }), o.addEventListener("error", e => {
        M(e);
    }), !d && f) try {
        const e = 解码WS早期数据(f, t);
        e?.byteLength && J(e.buffer);
    } catch (e) {
        M(e);
    }
    return new Response(null, {
        status: 101,
        webSocket: s,
        headers: {
            "Sec-WebSocket-Extensions": ""
        }
    });
}

const 木马文本解码器 = new TextDecoder;

function 解析木马反代地址(e) {
    const t = String(e || "").trim();
    if (!t || t.includes("/") || t.includes("@") || t.includes("://")) throw new Error("木马反代仅支持 host:port");
    let n = "", r = "";
    if (t.startsWith("[")) {
        const e = t.match(/^(\[[^\]]+\]):(\d+)$/);
        if (!e) throw new Error("无效的 IPv6 木马反代地址");
        n = e[1], r = e[2];
    } else {
        const e = t.split(":");
        if (2 !== e.length) throw new Error("木马反代仅支持 host:port");
        n = e[0], r = e[1];
    }
    const a = Number(r);
    if (!n || !Number.isInteger(a) || a < 1 || a > 65535) throw new Error("无效的木马反代端口");
    return {
        hostname: n,
        port: a
    };
}

async function 连接木马反代(e, t, n) {
    if (!n) throw new Error("trojan fallback is not configured");
    const r = t({
        hostname: stripIPv6Brackets(n.hostname),
        port: n.port
    });
    let a = null;
    try {
        return r.opened && await r.opened, 有效数据长度(e) > 0 && (a = r.writable.getWriter(), 
        await a.write(数据转Uint8Array(e))), r;
    } catch (e) {
        try {
            r?.close?.();
        } catch (e) {}
        throw e;
    } finally {
        try {
            a?.releaseLock();
        } catch (e) {}
    }
}

function 提取木马反代握手数据(e, t) {
    const n = 数据转Uint8Array(e), r = 数据转Uint8Array(t);
    if (!r.byteLength) return n;
    const a = n.byteLength - r.byteLength;
    if (a <= 0) return n;
    for (let e = 0; e < r.byteLength; e++) if (n[a + e] !== r[e]) return n;
    return n.subarray(0, a);
}

async function 转发木马UDP反代数据(e, t, n, r) {
    const a = 数据转Uint8Array(e);
    if (!n.反代Socket) {
        const e = 创建请求TCP连接器(r), s = await 连接木马反代(a, e, n.反代地址);
        return n.反代Socket = s, s.closed.catch(() => {}).finally(() => closeSocketQuietly(t)), 
        void connectStreams(s, t, null, null);
    }
    if (!a.byteLength) return;
    const s = n.反代Socket.writable.getWriter();
    try {
        await s.write(a);
    } finally {
        try {
            s.releaseLock();
        } catch (e) {}
    }
}

function 解析木马请求(e, t) {
    const n = 数据转Uint8Array(e), r = sha224(t);
    if (n.byteLength < 58) return {
        hasError: !0,
        message: "invalid data"
    };
    if (13 !== n[56] || 10 !== n[57]) return {
        hasError: !0,
        message: "invalid header format"
    };
    for (let e = 0; e < 56; e++) if (n[e] !== r.charCodeAt(e)) return {
        hasError: !0,
        message: "invalid password"
    };
    if (n.byteLength < 64) return {
        hasError: !0,
        message: "invalid S5 request data"
    };
    const a = n[58];
    if (1 !== a && 3 !== a) return {
        hasError: !0,
        message: "unsupported command, only TCP/UDP is allowed"
    };
    const s = 3 === a, o = n[59];
    let i = 0, c = 60, l = "";
    switch (o) {
      case 1:
        if (i = 4, n.byteLength < c + i + 4) return {
            hasError: !0,
            message: "invalid S5 request data"
        };
        l = `${n[c]}.${n[c + 1]}.${n[c + 2]}.${n[c + 3]}`;
        break;

      case 3:
        if (n.byteLength < c + 1) return {
            hasError: !0,
            message: "invalid S5 request data"
        };
        if (i = n[c], c += 1, n.byteLength < c + i + 4) return {
            hasError: !0,
            message: "invalid S5 request data"
        };
        l = 木马文本解码器.decode(n.subarray(c, c + i));
        break;

      case 4:
        if (i = 16, n.byteLength < c + i + 4) return {
            hasError: !0,
            message: "invalid S5 request data"
        };
        const e = [];
        for (let t = 0; t < 8; t++) {
            const r = c + 2 * t;
            e.push((n[r] << 8 | n[r + 1]).toString(16));
        }
        l = e.join(":");
        break;

      default:
        return {
            hasError: !0,
            message: `invalid addressType is ${o}`
        };
    }
    if (!l) return {
        hasError: !0,
        message: `address is empty, addressType is ${o}`
    };
    const u = c + i;
    if (n.byteLength < u + 4) return {
        hasError: !0,
        message: "invalid S5 request data"
    };
    return {
        hasError: !1,
        addressType: o,
        port: n[u] << 8 | n[u + 1],
        hostname: l,
        isUDP: s,
        rawClientData: n.subarray(u + 4)
    };
}

const UUID字节缓存 = new Map, VLESS文本解码器 = new TextDecoder;

function 读取十六进制半字节(e) {
    return e >= 48 && e <= 57 ? e - 48 : (e |= 32) >= 97 && e <= 102 ? e - 87 : -1;
}

function 获取UUID字节(e) {
    const t = String(e || "");
    let n = UUID字节缓存.get(t);
    if (n) return n;
    const r = t.replace(/-/g, "");
    if (32 !== r.length) return null;
    const a = new Uint8Array(16);
    for (let e = 0; e < 16; e++) {
        const t = 读取十六进制半字节(r.charCodeAt(2 * e)), n = 读取十六进制半字节(r.charCodeAt(2 * e + 1));
        if (t < 0 || n < 0) return null;
        a[e] = t << 4 | n;
    }
    return UUID字节缓存.size >= 32 && UUID字节缓存.clear(), UUID字节缓存.set(t, a), a;
}

function UUID字节匹配(e, t, n) {
    const r = 获取UUID字节(n);
    if (!r || e.byteLength < t + 16) return !1;
    for (let n = 0; n < 16; n++) if (e[t + n] !== r[n]) return !1;
    return !0;
}

function 解析魏烈思请求(e, t) {
    const n = 数据转Uint8Array(e), r = n.byteLength;
    if (r < 24) return {
        hasError: !0,
        message: "Invalid data"
    };
    const a = n[0];
    if (!UUID字节匹配(n, 1, t)) return {
        hasError: !0,
        message: "Invalid uuid"
    };
    const s = 18 + n[17];
    if (r < s + 4) return {
        hasError: !0,
        message: "Invalid data"
    };
    const o = n[s];
    let i = !1;
    if (1 === o) ; else {
        if (2 !== o) return {
            hasError: !0,
            message: "Invalid command"
        };
        i = !0;
    }
    const c = s + 1, l = n[c] << 8 | n[c + 1];
    let u = c + 3, h = 0, f = "";
    const d = n[c + 2];
    switch (d) {
      case 1:
        if (h = 4, r < u + h) return {
            hasError: !0,
            message: "Invalid IPv4 address length"
        };
        f = `${n[u]}.${n[u + 1]}.${n[u + 2]}.${n[u + 3]}`;
        break;

      case 2:
        if (r < u + 1) return {
            hasError: !0,
            message: "Invalid domain length"
        };
        if (h = n[u], u += 1, r < u + h) return {
            hasError: !0,
            message: "Invalid domain data"
        };
        f = VLESS文本解码器.decode(n.subarray(u, u + h));
        break;

      case 3:
        if (h = 16, r < u + h) return {
            hasError: !0,
            message: "Invalid IPv6 address length"
        };
        const e = [];
        for (let t = 0; t < 8; t++) {
            const r = u + 2 * t;
            e.push((n[r] << 8 | n[r + 1]).toString(16));
        }
        f = e.join(":");
        break;

      default:
        return {
            hasError: !0,
            message: `Invalid address type: ${d}`
        };
    }
    if (!f) return {
        hasError: !0,
        message: `Invalid address: ${d}`
    };
    const g = u + h;
    return {
        hasError: !1,
        addressType: d,
        port: l,
        hostname: f,
        isUDP: i,
        rawClientData: n.subarray(g),
        version: a
    };
}

const SS支持加密配置 = {
    "aes-128-gcm": {
        method: "aes-128-gcm",
        keyLen: 16,
        saltLen: 16,
        maxChunk: 16383,
        aesLength: 128
    },
    "aes-256-gcm": {
        method: "aes-256-gcm",
        keyLen: 32,
        saltLen: 32,
        maxChunk: 16383,
        aesLength: 256
    }
}, SSAEAD标签长度 = 16, SSNonce长度 = 12, SS子密钥信息 = (new TextEncoder).encode("ss-subkey"), SS文本编码器 = new TextEncoder, SS文本解码器 = new TextDecoder, SS主密钥缓存 = new Map;

function 数据转Uint8Array(e) {
    return e instanceof Uint8Array ? e : e instanceof ArrayBuffer ? new Uint8Array(e) : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : new Uint8Array(e || 0);
}

function 拼接字节数据(...e) {
    if (!e || 0 === e.length) return new Uint8Array(0);
    const t = e.map(数据转Uint8Array), n = t.reduce((e, t) => e + t.byteLength, 0), r = new Uint8Array(n);
    let a = 0;
    for (const e of t) r.set(e, a), a += e.byteLength;
    return r;
}

async function 转发木马UDP数据(e, t, n, r) {
    const a = 数据转Uint8Array(e);
    if (n?.反代地址) return 转发木马UDP反代数据(a, t, n, r);
    const s = n?.缓存 instanceof Uint8Array ? n.缓存 : new Uint8Array(0), o = s.byteLength ? 拼接字节数据(s, a) : a;
    let i = 0;
    for (;i < o.byteLength; ) {
        const e = i, n = o[i];
        let a = i + 1, s = 0;
        if (1 === n) s = 4; else if (4 === n) s = 16; else {
            if (3 !== n) throw new Error(`invalid trojan udp addressType: ${n}`);
            if (o.byteLength < a + 1) break;
            s = 1 + o[a];
        }
        const c = a + s;
        if (o.byteLength < c + 6) break;
        const l = o[c] << 8 | o[c + 1], u = o[c + 2] << 8 | o[c + 3];
        if (13 !== o[c + 4] || 10 !== o[c + 5]) throw new Error("invalid trojan udp delimiter");
        const h = c + 6, f = h + u;
        if (o.byteLength < f) break;
        const d = o.slice(e, c + 2), g = o.slice(h, f);
        if (i = f, 53 !== l) throw new Error("UDP is not supported");
        if (!g.byteLength) continue;
        let y = g;
        (g.byteLength < 2 || (g[0] << 8 | g[1]) != g.byteLength - 2) && (y = new Uint8Array(g.byteLength + 2), 
        y[0] = g.byteLength >>> 8 & 255, y[1] = 255 & g.byteLength, y.set(g, 2));
        const p = {
            "缓存": new Uint8Array(0)
        };
        await forwardataudp(y, t, null, r, e => {
            const t = 数据转Uint8Array(e), n = p.缓存.byteLength ? 拼接字节数据(p.缓存, t) : t, r = [];
            let a = 0;
            for (;a + 2 <= n.byteLength; ) {
                const e = a + 2, t = e + (n[a] << 8 | n[a + 1]);
                if (t > n.byteLength) break;
                const s = n.slice(e, t), o = new Uint8Array(d.byteLength + 4 + s.byteLength);
                o.set(d, 0), o[d.byteLength] = s.byteLength >>> 8 & 255, o[d.byteLength + 1] = 255 & s.byteLength, 
                o[d.byteLength + 2] = 13, o[d.byteLength + 3] = 10, o.set(s, d.byteLength + 4), 
                r.push(o), a = t;
            }
            return p.缓存 = n.slice(a), r.length ? r : new Uint8Array(0);
        });
    }
    n && (n.缓存 = o.slice(i));
}

function SS递增Nonce计数器(e) {
    for (let t = 0; t < e.length; t++) if (e[t] = e[t] + 1 & 255, 0 !== e[t]) return;
}

async function SS派生主密钥(e, t) {
    const n = `${t}:${e}`;
    if (SS主密钥缓存.has(n)) return SS主密钥缓存.get(n);
    const r = (async () => {
        const n = SS文本编码器.encode(e || "");
        let r = new Uint8Array(0), a = new Uint8Array(0);
        for (;a.byteLength < t; ) {
            const e = new Uint8Array(r.byteLength + n.byteLength);
            e.set(r, 0), e.set(n, r.byteLength), r = new Uint8Array(await crypto.subtle.digest("MD5", e)), 
            a = 拼接字节数据(a, r);
        }
        return a.slice(0, t);
    })();
    SS主密钥缓存.set(n, r);
    try {
        return await r;
    } catch (e) {
        throw SS主密钥缓存.delete(n), e;
    }
}

async function SS派生会话密钥(e, t, n, r) {
    const a = {
        name: "HMAC",
        hash: "SHA-1"
    }, s = await crypto.subtle.importKey("raw", n, a, !1, [ "sign" ]), o = new Uint8Array(await crypto.subtle.sign("HMAC", s, t)), i = await crypto.subtle.importKey("raw", o, a, !1, [ "sign" ]), c = new Uint8Array(e.keyLen);
    let l = new Uint8Array(0), u = 0, h = 1;
    for (;u < e.keyLen; ) {
        const t = 拼接字节数据(l, SS子密钥信息, new Uint8Array([ h ]));
        l = new Uint8Array(await crypto.subtle.sign("HMAC", i, t));
        const n = Math.min(l.byteLength, e.keyLen - u);
        c.set(l.subarray(0, n), u), u += n, h += 1;
    }
    return crypto.subtle.importKey("raw", c, {
        name: "AES-GCM",
        length: e.aesLength
    }, !1, r);
}

async function SSAEAD加密(e, t, n) {
    const r = t.slice(), a = await crypto.subtle.encrypt({
        name: "AES-GCM",
        iv: r,
        tagLength: 128
    }, e, n);
    return SS递增Nonce计数器(t), new Uint8Array(a);
}

async function SSAEAD解密(e, t, n) {
    const r = t.slice(), a = await crypto.subtle.decrypt({
        name: "AES-GCM",
        iv: r,
        tagLength: 128
    }, e, n);
    return SS递增Nonce计数器(t), new Uint8Array(a);
}

async function forwardataTCP(e, t, n, r, a, s, o, i = null, c = {}, l = !1, u = null, h = !1) {
    const f = c.反代IP || "", d = void 0 !== c.代理类型 ? c.代理类型 : null, g = void 0 !== c.代理全局 && c.代理全局, y = c.代理参数 || {}, p = void 0 === c.反代兜底 || c.反代兜底;
    let w = 0;
    log(`[TCP转发] 目标: ${e}:${t} | 反代IP: ${f} | 反代兜底: ${p ? "是" : "否"} | 反代类型: ${d || "proxyip"} | 全局: ${g ? "是" : "否"}`);
    let S = !1;
    const m = 创建请求TCP连接器(i), T = l && (c.木马反代地址 || null), b = T ? c.木马反代地址 : null, C = T ? 提取木马反代握手数据(u, n) : null;
    let A = a;
    const E = () => {
        const e = A;
        return A = null, e;
    };
    Number.isInteger(s.generation) || (s.generation = 0);
    const U = async (e, t, n, a = null) => {
        try {
            await n;
        } catch (a) {
            s.downlinkDrain === n && (s.downlinkDrain = Promise.resolve());
            try {
                e?.close?.();
            } catch (e) {}
            throw s.generation === t && closeSocketQuietly(r), a;
        }
        s.downlinkDrain === n && (s.downlinkDrain = Promise.resolve());
        const o = () => s.generation === t && s.socket === e;
        if (s.generation !== t || r.readyState !== WebSocket.OPEN) {
            try {
                e?.close?.();
            } catch (e) {}
            throw s.generation === t && (s.socket = null), new Error("connection superseded or client closed");
        }
        return s.socket = e, h ? e : (connectStreams(e, r, E, a, o, s).catch(t => {
            if (o()) {
                log(`[TCP下行] 处理失败: ${t?.message || t}`);
                try {
                    e?.close?.();
                } catch (e) {}
                closeSocketQuietly(r);
            }
        }), !0);
    };
    async function P(e, t) {
        const n = m({
            hostname: e,
            port: t
        });
        try {
            return await async function(e, t = 1e3) {
                await Promise.race([ e.opened, new Promise((e, n) => setTimeout(() => n(new Error("连接超时")), t)) ]);
            }(n), n;
        } catch (e) {
            try {
                n?.close?.();
            } catch (e) {}
            throw e;
        }
    }
    async function N(e, t) {
        if (有效数据长度(t) <= 0) return;
        const n = e.writable.getWriter();
        try {
            await n.write(数据转Uint8Array(t));
        } finally {
            try {
                n.releaseLock();
            } catch (e) {}
        }
    }
    async function _(e) {
        if (1 === e.length) {
            const t = e[0];
            return {
                socket: await P(t.hostname, t.port),
                candidate: t
            };
        }
        const t = e.map(e => P(e.hostname, e.port).then(t => ({
            socket: t,
            candidate: e
        })));
        let n = null;
        try {
            return n = await Promise.any(t), n;
        } finally {
            if (n) for (const e of t) e.then(({socket: e}) => {
                if (e !== n.socket) try {
                    e?.close?.();
                } catch (e) {}
            }).catch(() => {});
        }
    }
    async function k(e, t, n = null, r = !1) {
        const a = r ? await async function(e, t) {
            if (!预加载竞速拨号 || isIPHostname(e)) return null;
            log(`[TCP直连] 预加载竞速拨号开启，开始并发查询 ${e} 的 A/AAAA 记录`);
            const [n, r] = await Promise.all([ DoH查询(e, "A"), DoH查询(e, "AAAA") ]), a = [ ...new Set(n.flatMap(e => {
                const t = e.data;
                return 1 === e.type && "string" == typeof t && isIPv4(t) ? [ t ] : [];
            })) ], s = [ ...new Set(r.flatMap(e => {
                const t = e.data;
                return 28 === e.type && "string" == typeof t && isIPHostname(t) ? [ t ] : [];
            })) ], o = Math.max(1, 0 | TCP并发拨号数), i = a.length >= o ? a.slice(0, o) : a.concat(s.slice(0, o - a.length)), c = a.length > 0 ? i.length > a.length ? "A+AAAA" : "A" : "AAAA";
            if (0 === i.length) return log(`[TCP直连] ${e} 的 A/AAAA 未获得可用解析结果，预加载竞速不可用，回退到原始 hostname 直连。`), 
            null;
            const l = i;
            return log(`[TCP直连] ${e} A记录:${a.length} AAAA记录:${s.length}，使用${c}记录，竞速拨号 ${l.length}/${o}: ${l.join(", ")}`), 
            l.map((n, r) => ({
                hostname: n,
                port: t,
                attempt: r,
                resolvedFrom: e
            }));
        }(e, t) : null, s = a || Array.from({
            length: TCP并发拨号数
        }, (n, r) => ({
            hostname: e,
            port: t,
            attempt: r
        }));
        log(a ? `[TCP直连] 并发尝试 ${s.length} 路: ${s.map(e => `${e.hostname}:${e.port}`).join(", ")}` : `[TCP直连] 并发尝试 ${s.length} 路: ${e}:${t}`);
        let o = null;
        try {
            const t = await _(s);
            if (o = t.socket, a) {
                const n = t.candidate;
                log(`[TCP直连] 预加载竞速结果: ${n.hostname}:${n.port} 胜出，源域名: ${n.resolvedFrom || e}`);
            }
            return await N(o, n), o;
        } catch (e) {
            try {
                o?.close?.();
            } catch (e) {}
            throw a && log(`[TCP直连] 预加载竞速失败: ${e.message || e}`), e;
        }
    }
    async function L(a = !0) {
        if (s.connectingPromise) return void await s.connectingPromise;
        const {generation: i, downlinkDrain: c} = 开始TCP连接世代(s);
        let l = !1, h = null;
        T ? a && !S && 有效数据长度(u) > 0 ? (h = u, l = 有效数据长度(n) > 0) : h = C : (l = a && !S && 有效数据长度(n) > 0, 
        h = l ? n : null);
        const g = (async () => {
            let n = null;
            try {
                if (T) log(`[木马反代] 代理到: ${e}:${t}`), n = await 连接木马反代(h, m, b); else if ("socks5" === d) log(`[SOCKS5代理] 代理到: ${e}:${t}`), 
                n = await socks5Connect(e, t, h, m, y); else if ("http" === d) log(`[HTTP代理] 代理到: ${e}:${t}`), 
                n = await httpConnect(e, t, h, !1, m, y); else if ("https" === d) log(`[HTTPS代理] 代理到: ${e}:${t}`), 
                n = isIPHostname(y.hostname) ? await httpsConnect(e, t, h, m, y) : await httpConnect(e, t, h, !0, m, y); else if ("turn" === d) {
                    if (log(`[TURN代理] 代理到: ${e}:${t}`), n = await turnConnect(y, e, t, m), 有效数据长度(h) > 0) {
                        const e = n.writable.getWriter();
                        try {
                            await e.write(数据转Uint8Array(h));
                        } finally {
                            try {
                                e.releaseLock();
                            } catch (e) {}
                        }
                    }
                } else if ("sstp" === d) {
                    if (log(`[SSTP代理] 代理到: ${e}:${t}`), n = await sstpConnect(y, e, t, m), 有效数据长度(h) > 0) {
                        const e = n.writable.getWriter();
                        try {
                            await e.write(数据转Uint8Array(h));
                        } finally {
                            try {
                                e.releaseLock();
                            } catch (e) {}
                        }
                    }
                } else {
                    log(`[反代连接] 代理到: ${e}:${t}`);
                    const r = await 解析地址端口(f, e, o);
                    n = await async function(e, t, n = null, r = null, a = !0) {
                        if (r && r.length > 0) {
                            const e = Math.max(1, Math.floor(Number(反代并发拨号数) || 1));
                            for (let t = 0; t < r.length; t += e) {
                                const a = [];
                                for (let n = 0; n < e && t + n < r.length; n++) {
                                    const e = (w + t + n) % r.length, [s, o] = r[e];
                                    a.push({
                                        hostname: s,
                                        port: o,
                                        index: e
                                    });
                                }
                                let s = null, o = null;
                                try {
                                    log(`[反代连接] 并发尝试 ${a.length} 路: ${a.map(e => `${e.hostname}:${e.port}`).join(", ")}`);
                                    const e = await _(a);
                                    return s = e.socket, o = e.candidate, await N(s, n), log(`[反代连接] 成功连接到: ${o.hostname}:${o.port} (索引: ${o.index})`), 
                                    w = o.index, s;
                                } catch (e) {
                                    try {
                                        s?.close?.();
                                    } catch (e) {}
                                    log(`[反代连接] 本批连接失败: ${e.message || e}`);
                                }
                            }
                        }
                        if (a) return k(e, t, n, !1);
                        throw new Error("[反代连接] 所有反代连接失败，且未启用反代兜底，连接终止。");
                    }(`${特征码字典[0]}.tp1.${特征码字典[2]}.xyz`, 1, h, r, p);
                }
                await U(n, i, c), l && (S = !0);
            } catch (e) {
                try {
                    n?.close?.();
                } catch (e) {}
                if (s.generation === i) throw s.socket = null, closeSocketQuietly(r), e;
            }
        })();
        s.connectingPromise = g;
        try {
            await g;
        } finally {
            s.connectingPromise === g && (s.connectingPromise = null);
        }
    }
    if (s.retryConnect = async () => L(!S), d && (g || SOCKS5白名单.some(t => new RegExp(`^${t.replace(/\*/g, ".*")}$`, "i").test(e)))) {
        log("[TCP转发] 启用 SOCKS5/HTTP/HTTPS/TURN/SSTP 全局代理");
        try {
            if (await L(), h) return s.socket;
        } catch (e) {
            throw log(`[TCP转发] SOCKS5/HTTP/HTTPS/TURN/SSTP 代理连接失败: ${e.message}`), e;
        }
    } else {
        let a = s.generation;
        try {
            log(`[TCP转发] 尝试直连到: ${e}:${t}`);
            const r = 开始TCP连接世代(s);
            a = r.generation;
            const o = await k(e, t, n, !0);
            if (await U(o, a, r.downlinkDrain, async () => {
                s.generation === a && s.socket === o && await L();
            }), h) return o;
        } catch (n) {
            if (log(`[TCP转发] 直连 ${e}:${t} 失败: ${n.message}`), s.generation !== a) throw n;
            if (n instanceof Error && "预加载解析为空" === n.name) throw closeSocketQuietly(r), n;
            if (r.readyState !== WebSocket.OPEN) throw n;
            if (await L(), h) return s.socket;
        }
    }
}

async function forwardataudp(e, t, n, r, a = null) {
    const s = 数据转Uint8Array(e), o = s.byteLength;
    log(`[UDP转发] 收到 DNS 请求: ${o}B -> 8.8.4.4:53`);
    try {
        const e = 创建请求TCP连接器(r)({
            hostname: "8.8.4.4",
            port: 53
        });
        let i = n;
        const c = e.writable.getWriter();
        await c.write(s), log(`[UDP转发] DNS 请求已写入上游: ${o}B`), c.releaseLock(), await e.readable.pipeTo(new WritableStream({
            async write(e) {
                const n = 数据转Uint8Array(e);
                log(`[UDP转发] 收到 DNS 响应: ${n.byteLength}B`);
                const r = a ? await a(n) : n, s = Array.isArray(r) ? r : [ r ];
                if (s.length && t.readyState === WebSocket.OPEN) for (const e of s) {
                    const n = 数据转Uint8Array(e);
                    if (n.byteLength) if (i) {
                        const e = new Uint8Array(i.length + n.byteLength);
                        e.set(i, 0), e.set(n, i.length), await WebSocket发送并等待(t, e.buffer), i = null;
                    } else await WebSocket发送并等待(t, n);
                }
            }
        }));
    } catch (e) {
        log(`[UDP转发] DNS 转发失败: ${e?.message || e}`);
    }
}

function closeSocketQuietly(e) {
    try {
        e.readyState !== WebSocket.OPEN && e.readyState !== WebSocket.CLOSING || e.close();
    } catch (e) {}
}

function formatIdentifier(e, t = 0) {
    const n = [ ...e.slice(t, t + 16) ].map(e => e.toString(16).padStart(2, "0")).join("");
    return `${n.substring(0, 8)}-${n.substring(8, 12)}-${n.substring(12, 16)}-${n.substring(16, 20)}-${n.substring(20)}`;
}

async function WebSocket发送并等待(e, t) {
    const n = e.send(t);
    n && "function" == typeof n.then && await n;
}

function 创建Grain收纳器(e, t = !1) {
    let n = [], r = 0, a = 0, s = null;
    const o = () => r >= n.length, i = () => {
        r > 32 && 2 * r >= n.length && (n = n.slice(r), r = 0);
    };
    return {
        get "字节数"() {
            return a;
        },
        get "条目数"() {
            return n.length - r;
        },
        get "为空"() {
            return o();
        },
        "清空"(e = null) {
            if (e) for (let t = r; t < n.length; t++) n[t] && e(n[t]);
            n = [], r = 0, a = 0;
        },
        "收纳": e => !!e?.chunk?.byteLength && (n.push(e), a += e.chunk.byteLength, !0),
        "合包"() {
            const c = (() => {
                if (o()) return null;
                const e = n[r];
                return n[r++] = void 0, a -= e.chunk.byteLength, i(), e;
            })();
            if (!c) return null;
            const l = [ c ];
            if (o() || c.chunk.byteLength >= e) return {
                chunk: c.chunk,
                items: l
            };
            let u = c.chunk.byteLength, h = r;
            for (;h < n.length; ) {
                const t = u + n[h].chunk.byteLength;
                if (t > e) break;
                u = t, h++;
            }
            if (h === r) return {
                chunk: c.chunk,
                items: l
            };
            const f = s ||= new Uint8Array(e);
            f.set(c.chunk, 0);
            let d = c.chunk.byteLength;
            for (;r < h; ) {
                const e = n[r];
                n[r++] = void 0, a -= e.chunk.byteLength, l.push(e), f.set(e.chunk, d), d += e.chunk.byteLength;
            }
            i();
            const g = f.subarray(0, u);
            return {
                chunk: t ? g.slice() : g,
                items: l
            };
        }
    };
}

function 创建上行Grain合包流(e = 20480) {
    const t = "undefined" != typeof IdentityTransformStream ? new IdentityTransformStream : new TransformStream, n = t.writable.getWriter(), r = new Uint8Array(e);
    let a = 0, s = null, o = null, i = Promise.resolve();
    const c = () => {
        s && (clearTimeout(s), s = null);
    }, l = async e => {
        o && await o, o = n.write(e);
        try {
            await o;
        } finally {
            o = null;
        }
    }, u = async () => {
        if (a) {
            const e = r.slice(0, a);
            a = 0, await l(e);
        }
    }, h = () => {
        s || (s = setTimeout(() => {
            s = null, i = i.then(() => u()).catch(() => {});
        }, 1));
    };
    return {
        readable: t.readable,
        "写入": async t => {
            const n = 数据转Uint8Array(t);
            if (n.byteLength) {
                if (n.byteLength >= e) return c(), a && await u(), void await l(n);
                if (a + n.byteLength >= e) {
                    const e = new Uint8Array(a + n.byteLength);
                    e.set(r.subarray(0, a), 0), e.set(n, a), a = 0, c(), await l(e);
                } else r.set(n, a), a += n.byteLength, h();
            }
        },
        "结束": async () => {
            c();
            try {
                await i, await u(), await n.close();
            } finally {
                try {
                    n.releaseLock();
                } catch (e) {}
            }
        }
    };
}

function 创建上行写入队列({"获取写入器": e, "获取连接任务": t = null, "释放写入器": n, "重试连接": r, "关闭连接": a, "名称": s = "上行队列"}) {
    const o = 创建Grain收纳器(20480);
    let i = !1, c = !1, l = [], u = null;
    const h = (e, t = null) => {
        if (e) for (const n of e) t ? n.reject(t) : n.resolve();
    }, f = () => {
        if (o.字节数 || i || !l.length) return;
        const e = l;
        l = [];
        for (const t of e) t();
    }, d = (e = null) => {
        const t = e || (c ? new Error(`${s}: queue closed`) : null);
        t ? (o.清空(e => h(e.completions, t)), h(u, t), u = null) : o.清空(), f();
    }, g = () => {
        const e = o.合包();
        if (!e) return null;
        let t = !0, n = null;
        for (const r of e.items) t = t && r.allowRetry, r.completions && (n = n ? n.concat(r.completions) : r.completions);
        return {
            chunk: e.chunk,
            allowRetry: t,
            completions: n
        };
    }, y = async () => {
        let n = e();
        if (n) return n;
        const r = t?.();
        return r && await r, e();
    }, p = async () => {
        if (!i && !c) {
            i = !0;
            try {
                for (;!c; ) {
                    const t = g();
                    if (!t) break;
                    const a = t.completions || null;
                    u = a;
                    try {
                        let o = await y();
                        if (c) break;
                        if (!o) throw new Error(`${s}: remote writer unavailable`);
                        try {
                            await o.write(t.chunk);
                        } catch (a) {
                            if (n?.(), c) break;
                            if (!t.allowRetry || "function" != typeof r) throw a;
                            if (await r(), c) break;
                            if (o = e(), !o) throw a;
                            await o.write(t.chunk);
                        }
                        h(a);
                    } catch (e) {
                        throw h(a, e), e;
                    } finally {
                        u === a && (u = null);
                    }
                }
            } catch (e) {
                c = !0, d(e), log(`[${s}] 写入失败: ${e?.message || e}`);
                try {
                    a?.(e);
                } catch (e) {}
            } finally {
                i = !1, c || o.为空 ? f() : p();
            }
        }
    }, w = (n, r = !0, l = !1) => {
        if (c) return !1;
        if (!e() && !t?.()) return !1;
        const u = 数据转Uint8Array(n);
        if (!u.byteLength) return !0;
        const h = o.字节数 + u.byteLength, f = o.条目数 + 1;
        if (h > 16777216 || f > 4096) {
            c = !0;
            const e = Object.assign(new Error(`${s}: upload queue overflow (${h}B/${f})`), {
                isQueueOverflow: !0
            });
            d(e), log(`[${s}] 队列超限，关闭连接`);
            try {
                a?.(e);
            } catch (e) {}
            throw e;
        }
        let g = null, y = null;
        return l && (y = [], g = new Promise((e, t) => y.push({
            resolve: e,
            reject: t
        }))), o.收纳({
            chunk: u,
            allowRetry: r,
            completions: y
        }), i || p(), !l || g.then(() => !0);
    };
    return {
        "写入": (e, t = !0) => w(e, t, !1),
        "写入并等待": (e, t = !0) => w(e, t, !0),
        async "等待空"() {
            (o.字节数 || i) && await new Promise(e => l.push(e));
        },
        "清空"() {
            c = !0, d();
        }
    };
}

function 创建下行Grain发送器(e, t = null, n = null) {
    const r = 32768, a = 创建Grain收纳器(r, !0);
    let s = "function" == typeof t ? null : t;
    const o = "function" == typeof t ? t : () => {
        const e = s;
        return s = null, e;
    };
    let i = null, c = 0, l = 0, u = 0, h = null, f = null, d = !1, g = !1, y = 0, p = 0, w = null, S = [];
    const m = () => y || p ? new Promise(e => S.push(e)) : Promise.resolve(), T = () => {
        if (y || p || !S.length) return;
        const e = S;
        S = [];
        for (const t of e) t();
    }, b = () => {
        if (!w) return;
        const e = w;
        throw a.清空(), e;
    }, C = () => d || !n || n(), A = () => {
        C() && closeSocketQuietly(e);
    }, E = async t => {
        for (;f; ) await f;
        const n = (async t => {
            if (C()) {
                if (e.readyState !== WebSocket.OPEN) throw new Error("ws.readyState is not open");
                t = U(t), await WebSocket发送并等待(e, t);
            }
        })(t);
        f = n;
        try {
            await n;
        } finally {
            f === n && (f = null);
        }
    }, U = e => {
        const t = o();
        if (!t) return e;
        const n = new Uint8Array(t.length + e.byteLength);
        return n.set(t, 0), n.set(e, t.length), n;
    }, P = async () => {
        for (;h; ) await h;
        if (i && clearTimeout(i), i = null, u = 0, !C()) return void a.清空();
        const e = (async () => {
            for (;;) {
                if (!C()) {
                    a.清空();
                    break;
                }
                const e = a.合包();
                if (!e) break;
                await E(e.chunk);
            }
        })();
        return h = e.catch(e => {
            throw w ||= e, e;
        }).finally(() => {
            h = null;
        }), h;
    }, N = () => {
        C() ? a.为空 || i || (a.字节数 >= r || r - a.字节数 < 512 ? P().catch(A) : i = setTimeout(() => {
            if (i = null, C()) {
                if (!a.为空) {
                    if (!(a.字节数 >= r || r - a.字节数 < 512)) return u < 4 && (c !== l || a.字节数 < 下行Grain低水位字节) ? (u++, 
                    l = c, void N()) : void P().catch(A);
                    P().catch(A);
                }
            } else a.清空();
        }, 1)) : a.清空();
    };
    return {
        async "直接发送"(e) {
            if (!g && C()) {
                p++;
                try {
                    const t = 数据转Uint8Array(e);
                    if (!t.byteLength) return;
                    await E(t);
                } catch (e) {
                    throw w ||= e, e;
                } finally {
                    p--, T();
                }
            }
        },
        async "发送"(e) {
            if (!g && C()) {
                y++;
                try {
                    const t = 数据转Uint8Array(e);
                    if (!t.byteLength) return;
                    let n = 0;
                    const s = t.byteLength;
                    for (;n < s; ) {
                        const e = s - n;
                        if (a.为空 && e >= r) {
                            const a = Math.min(r, e), o = n || a !== s ? t.subarray(n, n + a) : t;
                            await E(o), n += a;
                            continue;
                        }
                        const o = Math.min(r - a.字节数, s - n);
                        o ? (a.收纳({
                            chunk: n || o !== s ? t.subarray(n, n + o) : t
                        }), n += o, c++, a.字节数 >= r || r - a.字节数 < 512 ? await P() : N()) : await P();
                    }
                } catch (e) {
                    throw w ||= e, e;
                } finally {
                    y--, T();
                }
            }
        },
        flush: P,
        async "停止并刷新"() {
            if (g) {
                for (await m(); f; ) await f;
                return b(), void await P();
            }
            for (g = !0, d = !0, i && clearTimeout(i), i = null, await m(); f; ) await f;
            b(), await P();
        }
    };
}

async function connectStreams(e, t, n, r, a = null, s = null) {
    let o, i = n, c = !1, l = !1, u = null;
    const h = 65536, f = () => !a || a(), d = 创建下行Grain发送器(t, i, f);
    i = null;
    const g = {
        "停止并刷新": () => d.停止并刷新()
    };
    s && (s.downlinkController = g);
    try {
        e.closed?.catch?.(() => {});
    } catch (e) {}
    try {
        o = e.readable.getReader({
            mode: "byob"
        }), l = !0;
    } catch (t) {
        o = e.readable.getReader();
    }
    try {
        if (l) {
            let e = new ArrayBuffer(h);
            for (;;) {
                const {done: t, value: n} = await o.read(new Uint8Array(e, 0, h));
                if (!f()) break;
                if (t) break;
                n && 0 !== n.byteLength && (c = !0, n.byteLength >= 32768 ? (await d.flush(), await d.直接发送(n), 
                e = new ArrayBuffer(h)) : (await d.发送(n.slice()), e = n.buffer.byteLength >= h ? n.buffer : new ArrayBuffer(h)));
            }
        } else for (;;) {
            const {done: e, value: t} = await o.read();
            if (!f()) break;
            if (e) break;
            t && 0 !== t.byteLength && (c = !0, t.byteLength >= 32768 ? (await d.flush(), await d.直接发送(t)) : await d.发送(t));
        }
        f() && await d.flush();
    } catch (e) {
        u = e;
    } finally {
        if (f() && t.readyState === WebSocket.OPEN) try {
            await d.停止并刷新();
        } catch (e) {
            u ||= e;
        }
        s?.downlinkController === g && (s.downlinkController = null);
        try {
            await o.cancel();
        } catch (e) {}
        try {
            o.releaseLock();
        } catch (e) {}
        try {
            e.close();
        } catch (e) {}
    }
    if (!c && r && t.readyState === WebSocket.OPEN && f()) try {
        return void await r();
    } catch (e) {
        u ||= e;
    }
    f() && (u && log(`[TCP下行] 读取失败: ${u?.message || u}`), closeSocketQuietly(t));
}

function isSpeedTestSite(e) {
    return e = e.toLowerCase(), [ "speed.cloudflare.com", "cp.cloudflare.com" ].some(t => e === t || e.endsWith("." + t));
}

function 构造本地204响应(e = null) {
    const t = (new TextEncoder).encode("HTTP/1.1 204 No Content\r\nContent-Length: 0\r\nConnection: close\r\n\r\n");
    if (0 === 有效数据长度(e)) return t;
    const n = 数据转Uint8Array(e), r = new Uint8Array(n.byteLength + t.byteLength);
    return r.set(n, 0), r.set(t, n.byteLength), log(`[TCP转发] 构造本地204响应: ${r.byteLength}B`), 
    r;
}

function 构造WS本地204响应(e = null) {
    const t = (new TextEncoder).encode("HTTP/1.1 204 No Content\r\nContent-Length: 0\r\nConnection: keep-alive\r\n\r\n");
    if (0 === 有效数据长度(e)) return t;
    const n = 数据转Uint8Array(e), r = new Uint8Array(n.byteLength + t.byteLength);
    return r.set(n, 0), r.set(t, n.byteLength), r;
}

async function socks5Connect(e, t, n, r, a) {
    const {username: s, password: o, hostname: i, port: c} = a || {}, l = r({
        hostname: i,
        port: c
    }), u = l.writable.getWriter(), h = l.readable.getReader();
    try {
        const r = s && o ? new Uint8Array([ 5, 2, 0, 2 ]) : new Uint8Array([ 5, 1, 0 ]);
        await u.write(r);
        let a = await h.read();
        if (a.done || a.value.byteLength < 2) throw new Error("S5 method selection failed");
        const i = new Uint8Array(a.value)[1];
        if (2 === i) {
            if (!s || !o) throw new Error("S5 requires authentication");
            const e = (new TextEncoder).encode(s), t = (new TextEncoder).encode(o), n = new Uint8Array([ 1, e.length, ...e, t.length, ...t ]);
            if (await u.write(n), a = await h.read(), a.done || 0 !== new Uint8Array(a.value)[1]) throw new Error("S5 authentication failed");
        } else if (0 !== i) throw new Error(`S5 unsupported auth method: ${i}`);
        const c = (new TextEncoder).encode(e), f = new Uint8Array([ 5, 1, 0, 3, c.length, ...c, t >> 8, 255 & t ]);
        if (await u.write(f), a = await h.read(), a.done || 0 !== new Uint8Array(a.value)[1]) throw new Error("S5 connection failed");
        return 有效数据长度(n) > 0 && await u.write(n), u.releaseLock(), h.releaseLock(), l;
    } catch (e) {
        try {
            u.releaseLock();
        } catch (e) {}
        try {
            h.releaseLock();
        } catch (e) {}
        try {
            l.close();
        } catch (e) {}
        throw e;
    }
}

async function httpConnect(e, t, n, r = !1, a, s) {
    const {username: o, password: i, hostname: c, port: l} = s || {}, u = r ? a({
        hostname: c,
        port: l
    }, {
        secureTransport: "on",
        allowHalfOpen: !1
    }) : a({
        hostname: c,
        port: l
    }), h = u.writable.getWriter(), f = u.readable.getReader(), d = new TextEncoder, g = new TextDecoder;
    try {
        r && await u.opened;
        const a = `CONNECT ${e}:${t} HTTP/1.1\r\nHost: ${e}:${t}\r\n${o && i ? `Proxy-Authorization: Basic ${btoa(`${o}:${i}`)}\r\n` : ""}User-Agent: Mozilla/5.0\r\nConnection: keep-alive\r\n\r\n`;
        await h.write(d.encode(a)), h.releaseLock();
        let s = new Uint8Array(0), c = -1, l = 0;
        for (;-1 === c && l < 8192; ) {
            const {done: e, value: t} = await f.read();
            if (e || !t) throw new Error((r ? "HTTPS" : "HTTP") + " 代理在返回 CONNECT 响应前关闭连接");
            s = new Uint8Array([ ...s, ...t ]), l = s.length;
            const n = s.findIndex((e, t) => t < s.length - 3 && 13 === s[t] && 10 === s[t + 1] && 13 === s[t + 2] && 10 === s[t + 3]);
            -1 !== n && (c = n + 4);
        }
        if (-1 === c) throw new Error("代理 CONNECT 响应头过长或无效");
        const y = g.decode(s.slice(0, c)).split("\r\n")[0].match(/HTTP\/\d\.\d\s+(\d+)/), p = y ? parseInt(y[1], 10) : NaN;
        if (!Number.isFinite(p) || p < 200 || p >= 300) throw new Error(`Connection failed: HTTP ${p}`);
        if (f.releaseLock(), 有效数据长度(n) > 0) {
            const e = u.writable.getWriter();
            await e.write(n), e.releaseLock();
        }
        if (l > c) {
            const {readable: e, writable: t} = new TransformStream, n = t.getWriter();
            return await n.write(s.subarray(c, l)), n.releaseLock(), u.readable.pipeTo(t).catch(() => {}), 
            {
                readable: e,
                writable: u.writable,
                closed: u.closed,
                close: () => u.close()
            };
        }
        return u;
    } catch (e) {
        try {
            h.releaseLock();
        } catch (e) {}
        try {
            f.releaseLock();
        } catch (e) {}
        try {
            u.close();
        } catch (e) {}
        throw e;
    }
}

async function httpsConnect(e, t, n, r, a) {
    const {username: s, password: o, hostname: i, port: c} = a || {}, l = new TextEncoder, u = new TextDecoder;
    let h = null;
    const f = isIPHostname(i) ? "" : stripIPv6Brackets(i), d = async (e = !1) => {
        const t = r({
            hostname: i,
            port: c
        });
        try {
            await t.opened;
            const n = new TlsClient(t, {
                serverName: f,
                insecure: !0,
                allowChacha: e
            });
            return await n.handshake(), log(`[HTTPS代理] TLS版本: ${n.isTls13 ? "1.3" : "1.2"} | Cipher: 0x${n.cipherSuite.toString(16)}${n.cipherConfig?.chacha ? " (ChaCha20)" : " (AES-GCM)"}`), 
            n;
        } catch (e) {
            try {
                t.close();
            } catch (e) {}
            throw e;
        }
    };
    try {
        try {
            h = await d(!1);
        } catch (e) {
            if (!/cipher|handshake|TLS Alert|ServerHello|Finished|Unsupported|Missing TLS/i.test(e?.message || `${e || ""}`)) throw e;
            log(`[HTTPS代理] AES-GCM TLS 握手失败，回退 ChaCha20 兼容模式: ${e?.message || e}`), h = await d(!0);
        }
        const r = `CONNECT ${e}:${t} HTTP/1.1\r\nHost: ${e}:${t}\r\n${s && o ? `Proxy-Authorization: Basic ${btoa(`${s}:${o}`)}\r\n` : ""}User-Agent: Mozilla/5.0\r\nConnection: keep-alive\r\n\r\n`;
        await h.write(l.encode(r));
        let a = new Uint8Array(0), i = -1, c = 0;
        for (;-1 === i && c < 8192; ) {
            const e = await h.read();
            if (!e) throw new Error("HTTPS 代理在返回 CONNECT 响应前关闭连接");
            a = 拼接字节数据(a, e), c = a.length;
            const t = a.findIndex((e, t) => t < a.length - 3 && 13 === a[t] && 10 === a[t + 1] && 13 === a[t + 2] && 10 === a[t + 3]);
            -1 !== t && (i = t + 4);
        }
        if (-1 === i) throw new Error("HTTPS 代理 CONNECT 响应头过长或无效");
        const f = u.decode(a.slice(0, i)).split("\r\n")[0].match(/HTTP\/\d\.\d\s+(\d+)/), g = f ? parseInt(f[1], 10) : NaN;
        if (!Number.isFinite(g) || g < 200 || g >= 300) throw new Error(`Connection failed: HTTP ${g}`);
        有效数据长度(n) > 0 && await h.write(数据转Uint8Array(n));
        const y = c > i ? a.subarray(i, c) : null;
        let p, w, S = !1;
        const m = (e, t) => {
            S || (S = !0, e(t));
        }, T = new Promise((e, t) => {
            p = e, w = t;
        }), b = () => {
            try {
                h.close();
            } catch (e) {}
            m(p);
        }, C = new ReadableStream({
            async start(e) {
                try {
                    for (有效数据长度(y) > 0 && e.enqueue(y); ;) {
                        const t = await h.read();
                        if (!t) break;
                        t.byteLength > 0 && e.enqueue(t);
                    }
                    try {
                        e.close();
                    } catch (e) {}
                    m(p);
                } catch (t) {
                    try {
                        e.error(t);
                    } catch (e) {}
                    m(w, t);
                }
            },
            cancel() {
                b();
            }
        });
        return {
            readable: C,
            writable: new WritableStream({
                async write(e) {
                    await h.write(数据转Uint8Array(e));
                },
                close: b,
                abort(e) {
                    b(), e && m(w, e);
                }
            }),
            closed: T,
            close: b
        };
    } catch (e) {
        try {
            h?.close();
        } catch (e) {}
        throw e;
    }
}

function 创建请求TCP连接器(e) {
    const t = e, n = t?.fetcher;
    if (!n || "function" != typeof n.connect) throw new Error("request.fetcher.connect unavailable");
    return (e, t) => void 0 === t ? n.connect(e) : n.connect(e, t);
}

const TLS_VERSION_10 = 769, TLS_VERSION_12 = 771, TLS_VERSION_13 = 772, CONTENT_TYPE_CHANGE_CIPHER_SPEC = 20, CONTENT_TYPE_ALERT = 21, CONTENT_TYPE_HANDSHAKE = 22, CONTENT_TYPE_APPLICATION_DATA = 23, HANDSHAKE_TYPE_CLIENT_HELLO = 1, HANDSHAKE_TYPE_SERVER_HELLO = 2, HANDSHAKE_TYPE_NEW_SESSION_TICKET = 4, HANDSHAKE_TYPE_ENCRYPTED_EXTENSIONS = 8, HANDSHAKE_TYPE_CERTIFICATE = 11, HANDSHAKE_TYPE_SERVER_KEY_EXCHANGE = 12, HANDSHAKE_TYPE_CERTIFICATE_REQUEST = 13, HANDSHAKE_TYPE_SERVER_HELLO_DONE = 14, HANDSHAKE_TYPE_CERTIFICATE_VERIFY = 15, HANDSHAKE_TYPE_CLIENT_KEY_EXCHANGE = 16, HANDSHAKE_TYPE_FINISHED = 20, HANDSHAKE_TYPE_KEY_UPDATE = 24, EXT_SERVER_NAME = 0, EXT_SUPPORTED_GROUPS = 10, EXT_EC_POINT_FORMATS = 11, EXT_SIGNATURE_ALGORITHMS = 13, EXT_APPLICATION_LAYER_PROTOCOL_NEGOTIATION = 16, EXT_SUPPORTED_VERSIONS = 43, EXT_PSK_KEY_EXCHANGE_MODES = 45, EXT_KEY_SHARE = 51, ALERT_CLOSE_NOTIFY = 0, ALERT_LEVEL_WARNING = 1, ALERT_UNRECOGNIZED_NAME = 112, shouldIgnoreTlsAlert = e => 1 === e?.[0] && 112 === e?.[1], textEncoder = new TextEncoder, textDecoder = new TextDecoder, EMPTY_BYTES = new Uint8Array(0), CIPHER_SUITES_BY_ID = new Map([ [ 4865, {
    id: 4865,
    keyLen: 16,
    ivLen: 12,
    hash: "SHA-256",
    tls13: !0
} ], [ 4866, {
    id: 4866,
    keyLen: 32,
    ivLen: 12,
    hash: "SHA-384",
    tls13: !0
} ], [ 4867, {
    id: 4867,
    keyLen: 32,
    ivLen: 12,
    hash: "SHA-256",
    tls13: !0,
    chacha: !0
} ], [ 49199, {
    id: 49199,
    keyLen: 16,
    ivLen: 4,
    hash: "SHA-256",
    kex: "ECDHE"
} ], [ 49200, {
    id: 49200,
    keyLen: 32,
    ivLen: 4,
    hash: "SHA-384",
    kex: "ECDHE"
} ], [ 52392, {
    id: 52392,
    keyLen: 32,
    ivLen: 12,
    hash: "SHA-256",
    kex: "ECDHE",
    chacha: !0
} ], [ 49195, {
    id: 49195,
    keyLen: 16,
    ivLen: 4,
    hash: "SHA-256",
    kex: "ECDHE"
} ], [ 49196, {
    id: 49196,
    keyLen: 32,
    ivLen: 4,
    hash: "SHA-384",
    kex: "ECDHE"
} ], [ 52393, {
    id: 52393,
    keyLen: 32,
    ivLen: 12,
    hash: "SHA-256",
    kex: "ECDHE",
    chacha: !0
} ] ]), GROUPS_BY_ID = new Map([ [ 29, "X25519" ], [ 23, "P-256" ] ]), SUPPORTED_SIGNATURE_ALGORITHMS = [ 2052, 2053, 2054, 1025, 1281, 1537, 1027, 1283, 1539 ], tlsBytes = (...e) => {
    const t = e => e.flatMap(e => e instanceof Uint8Array ? [ ...e ] : Array.isArray(e) ? t(e) : "number" == typeof e ? [ e ] : []);
    return new Uint8Array(t(e));
}, uint16be = e => [ e >> 8 & 255, 255 & e ], readUint16 = (e, t) => e[t] << 8 | e[t + 1], readUint24 = (e, t) => e[t] << 16 | e[t + 1] << 8 | e[t + 2], concatBytes = (...e) => {
    const t = e.filter(e => e && e.length > 0), n = t.reduce((e, t) => e + t.length, 0), r = new Uint8Array(n);
    let a = 0;
    for (const e of t) r.set(e, a), a += e.length;
    return r;
}, randomBytes = e => crypto.getRandomValues(new Uint8Array(e)), constantTimeEqual = (e, t) => {
    if (!e || !t || e.length !== t.length) return !1;
    let n = 0;
    for (let r = 0; r < e.length; r++) n |= e[r] ^ t[r];
    return 0 === n;
}, hashByteLength = e => "SHA-512" === e ? 64 : "SHA-384" === e ? 48 : 32;

async function hmac(e, t, n) {
    const r = await crypto.subtle.importKey("raw", t, {
        name: "HMAC",
        hash: e
    }, !1, [ "sign" ]);
    return new Uint8Array(await crypto.subtle.sign("HMAC", r, n));
}

async function digestBytes(e, t) {
    return new Uint8Array(await crypto.subtle.digest(e, t));
}

async function tls12Prf(e, t, n, r, a = "SHA-256") {
    const s = concatBytes(textEncoder.encode(t), n);
    let o = new Uint8Array(0), i = s;
    for (;o.length < r; ) {
        i = await hmac(a, e, i);
        const t = await hmac(a, e, concatBytes(i, s));
        o = concatBytes(o, t);
    }
    return o.slice(0, r);
}

async function hkdfExtract(e, t, n) {
    return t && t.length || (t = new Uint8Array(hashByteLength(e))), hmac(e, t, n);
}

async function hkdfExpandLabel(e, t, n, r, a) {
    const s = textEncoder.encode("tls13 " + n);
    return async function(e, t, n, r) {
        const a = hashByteLength(e), s = Math.ceil(r / a);
        let o = new Uint8Array(0), i = new Uint8Array(0);
        for (let r = 1; r <= s; r++) i = await hmac(e, t, concatBytes(i, n, [ r ])), o = concatBytes(o, i);
        return o.slice(0, r);
    }(e, t, tlsBytes(uint16be(a), s.length, s, r.length, r), a);
}

async function generateKeyShare(e = "P-256") {
    const t = "X25519" === e ? {
        name: "X25519"
    } : {
        name: "ECDH",
        namedCurve: e
    }, n = await crypto.subtle.generateKey(t, !0, [ "deriveBits" ]), r = await crypto.subtle.exportKey("raw", n.publicKey);
    return {
        keyPair: n,
        publicKeyRaw: new Uint8Array(r)
    };
}

async function deriveSharedSecret(e, t, n = "P-256") {
    const r = "X25519" === n ? {
        name: "X25519"
    } : {
        name: "ECDH",
        namedCurve: n
    }, a = await crypto.subtle.importKey("raw", t, r, !1, []), s = "P-384" === n ? 384 : "P-521" === n ? 528 : 256;
    return new Uint8Array(await crypto.subtle.deriveBits({
        name: r.name,
        public: a
    }, e, s));
}

async function importAesGcmKey(e, t) {
    return crypto.subtle.importKey("raw", e, {
        name: "AES-GCM"
    }, !1, t);
}

async function aesGcmEncryptWithKey(e, t, n, r) {
    return new Uint8Array(await crypto.subtle.encrypt({
        name: "AES-GCM",
        iv: t,
        additionalData: r,
        tagLength: 128
    }, e, n));
}

async function aesGcmDecryptWithKey(e, t, n, r) {
    return new Uint8Array(await crypto.subtle.decrypt({
        name: "AES-GCM",
        iv: t,
        additionalData: r,
        tagLength: 128
    }, e, n));
}

function rotateLeft32(e, t) {
    return (e << t | e >>> 32 - t) >>> 0;
}

function chachaQuarterRound(e, t, n, r, a) {
    e[t] = e[t] + e[n] >>> 0, e[a] = rotateLeft32(e[a] ^ e[t], 16), e[r] = e[r] + e[a] >>> 0, 
    e[n] = rotateLeft32(e[n] ^ e[r], 12), e[t] = e[t] + e[n] >>> 0, e[a] = rotateLeft32(e[a] ^ e[t], 8), 
    e[r] = e[r] + e[a] >>> 0, e[n] = rotateLeft32(e[n] ^ e[r], 7);
}

function chacha20Block(e, t, n) {
    const r = new Uint32Array(16);
    r[0] = 1634760805, r[1] = 857760878, r[2] = 2036477234, r[3] = 1797285236;
    const a = new DataView(e.buffer, e.byteOffset, e.byteLength);
    for (let e = 0; e < 8; e++) r[4 + e] = a.getUint32(4 * e, !0);
    r[12] = t;
    const s = new DataView(n.buffer, n.byteOffset, n.byteLength);
    r[13] = s.getUint32(0, !0), r[14] = s.getUint32(4, !0), r[15] = s.getUint32(8, !0);
    const o = new Uint32Array(r);
    for (let e = 0; e < 10; e++) chachaQuarterRound(o, 0, 4, 8, 12), chachaQuarterRound(o, 1, 5, 9, 13), 
    chachaQuarterRound(o, 2, 6, 10, 14), chachaQuarterRound(o, 3, 7, 11, 15), chachaQuarterRound(o, 0, 5, 10, 15), 
    chachaQuarterRound(o, 1, 6, 11, 12), chachaQuarterRound(o, 2, 7, 8, 13), chachaQuarterRound(o, 3, 4, 9, 14);
    for (let e = 0; e < 16; e++) o[e] = o[e] + r[e] >>> 0;
    return new Uint8Array(o.buffer.slice(0));
}

function chacha20Xor(e, t, n) {
    const r = new Uint8Array(n.length);
    let a = 1;
    for (let s = 0; s < n.length; s += 64) {
        const o = chacha20Block(e, a++, t), i = Math.min(64, n.length - s);
        for (let e = 0; e < i; e++) r[s + e] = n[s + e] ^ o[e];
    }
    return r;
}

function poly1305Mac(e, t) {
    const n = function(e) {
        const t = new Uint8Array(e);
        return t[3] &= 15, t[7] &= 15, t[11] &= 15, t[15] &= 15, t[4] &= 252, t[8] &= 252, 
        t[12] &= 252, t;
    }(e.slice(0, 16)), r = e.slice(16, 32);
    let a = [ 0n, 0n, 0n, 0n, 0n ];
    const s = [ 0x3ffffffn & BigInt(n[0] | n[1] << 8 | n[2] << 16 | n[3] << 24), 0x3ffffffn & BigInt(n[3] >> 2 | n[4] << 6 | n[5] << 14 | n[6] << 22), 0x3ffffffn & BigInt(n[6] >> 4 | n[7] << 4 | n[8] << 12 | n[9] << 20), 0x3ffffffn & BigInt(n[9] >> 6 | n[10] << 2 | n[11] << 10 | n[12] << 18), 0x3ffffffn & BigInt(n[13] | n[14] << 8 | n[15] << 16) ];
    for (let e = 0; e < t.length; e += 16) {
        const n = t.slice(e, e + 16), r = new Uint8Array(17);
        r.set(n), r[n.length] = 1, a[0] += BigInt(r[0] | r[1] << 8 | r[2] << 16 | (3 & r[3]) << 24), 
        a[1] += BigInt(r[3] >> 2 | r[4] << 6 | r[5] << 14 | (15 & r[6]) << 22), a[2] += BigInt(r[6] >> 4 | r[7] << 4 | r[8] << 12 | (63 & r[9]) << 20), 
        a[3] += BigInt(r[9] >> 6 | r[10] << 2 | r[11] << 10 | r[12] << 18), a[4] += BigInt(r[13] | r[14] << 8 | r[15] << 16 | r[16] << 24);
        const o = [ 0n, 0n, 0n, 0n, 0n ];
        for (let e = 0; e < 5; e++) for (let t = 0; t < 5; t++) {
            const n = e + t;
            n < 5 ? o[n] += a[e] * s[t] : o[n - 5] += a[e] * s[t] * 5n;
        }
        let i = 0n;
        for (let e = 0; e < 5; e++) o[e] += i, a[e] = 0x3ffffffn & o[e], i = o[e] >> 26n;
        a[0] += 5n * i, i = a[0] >> 26n, a[0] &= 0x3ffffffn, a[1] += i;
    }
    let o = a[0] | a[1] << 26n | a[2] << 52n | a[3] << 78n | a[4] << 104n;
    o = o + r.reduce((e, t, n) => e + (BigInt(t) << BigInt(8 * n)), 0n) & (1n << 128n) - 1n;
    const i = new Uint8Array(16);
    for (let e = 0; e < 16; e++) i[e] = Number(o >> BigInt(8 * e) & 0xffn);
    return i;
}

function chacha20Poly1305Encrypt(e, t, n, r) {
    const a = chacha20Block(e, 0, t).slice(0, 32), s = chacha20Xor(e, t, n), o = (16 - r.length % 16) % 16, i = (16 - s.length % 16) % 16, c = new Uint8Array(r.length + o + s.length + i + 16);
    c.set(r, 0), c.set(s, r.length + o);
    const l = new DataView(c.buffer, r.length + o + s.length + i);
    l.setBigUint64(0, BigInt(r.length), !0), l.setBigUint64(8, BigInt(s.length), !0);
    const u = poly1305Mac(a, c);
    return concatBytes(s, u);
}

function chacha20Poly1305Decrypt(e, t, n, r) {
    if (n.length < 16) throw new Error("Ciphertext too short");
    const a = n.slice(-16), s = n.slice(0, -16), o = chacha20Block(e, 0, t).slice(0, 32), i = (16 - r.length % 16) % 16, c = (16 - s.length % 16) % 16, l = new Uint8Array(r.length + i + s.length + c + 16);
    l.set(r, 0), l.set(s, r.length + i);
    const u = new DataView(l.buffer, r.length + i + s.length + c);
    u.setBigUint64(0, BigInt(r.length), !0), u.setBigUint64(8, BigInt(s.length), !0);
    const h = poly1305Mac(o, l);
    let f = 0;
    for (let e = 0; e < 16; e++) f |= a[e] ^ h[e];
    if (0 !== f) throw new Error("ChaCha20-Poly1305 authentication failed");
    return chacha20Xor(e, t, s);
}

const TLS_MAX_PLAINTEXT_FRAGMENT = 16384;

function buildTlsRecord(e, t, n = 771) {
    const r = 数据转Uint8Array(t), a = new Uint8Array(5 + r.byteLength);
    return a[0] = e, a[1] = n >> 8 & 255, a[2] = 255 & n, a[3] = r.byteLength >> 8 & 255, 
    a[4] = 255 & r.byteLength, a.set(r, 5), a;
}

function buildHandshakeMessage(e, t) {
    return tlsBytes(e, [ (n = t.length) >> 16 & 255, n >> 8 & 255, 255 & n ], t);
    var n;
}

class TlsRecordParser {
    constructor() {
        this.buffer = new Uint8Array(0);
    }
    feed(e) {
        const t = 数据转Uint8Array(e);
        this.buffer = this.buffer.length ? concatBytes(this.buffer, t) : t;
    }
    next() {
        if (this.buffer.length < 5) return null;
        const e = this.buffer[0], t = readUint16(this.buffer, 1), n = readUint16(this.buffer, 3);
        if (this.buffer.length < 5 + n) return null;
        const r = this.buffer.subarray(5, 5 + n);
        return this.buffer = this.buffer.subarray(5 + n), {
            type: e,
            version: t,
            length: n,
            fragment: r
        };
    }
}

class TlsHandshakeParser {
    constructor() {
        this.buffer = new Uint8Array(0);
    }
    feed(e) {
        const t = 数据转Uint8Array(e);
        this.buffer = this.buffer.length ? concatBytes(this.buffer, t) : t;
    }
    next() {
        if (this.buffer.length < 4) return null;
        const e = this.buffer[0], t = readUint24(this.buffer, 1);
        if (this.buffer.length < 4 + t) return null;
        const n = this.buffer.subarray(4, 4 + t), r = this.buffer.subarray(0, 4 + t);
        return this.buffer = this.buffer.subarray(4 + t), {
            type: e,
            length: t,
            body: n,
            raw: r
        };
    }
}

function parseServerHello(e) {
    let t = 0;
    const n = readUint16(e, t);
    t += 2;
    const r = e.slice(t, t + 32);
    t += 32;
    const a = e[t++], s = e.slice(t, t + a);
    t += a;
    const o = readUint16(e, t);
    t += 2;
    const i = e[t++];
    let c = n, l = null, u = null;
    if (t < e.length) {
        const n = readUint16(e, t);
        t += 2;
        const r = t + n;
        for (;t + 4 <= r; ) {
            const n = readUint16(e, t);
            t += 2;
            const r = readUint16(e, t);
            t += 2;
            const a = e.slice(t, t + r);
            if (t += r, 43 === n && r >= 2) c = readUint16(a, 0); else if (51 === n && r >= 4) {
                const e = readUint16(a, 0), t = readUint16(a, 2);
                l = {
                    group: e,
                    key: a.slice(4, 4 + t)
                };
            } else 16 === n && r >= 3 && (u = textDecoder.decode(a.slice(3, 3 + a[2])));
        }
    }
    const h = new Uint8Array([ 207, 33, 173, 116, 229, 154, 97, 17, 190, 29, 140, 2, 30, 101, 184, 145, 194, 162, 17, 22, 122, 187, 140, 94, 7, 158, 9, 226, 200, 168, 51, 156 ]);
    return {
        version: n,
        serverRandom: r,
        sessionId: s,
        cipherSuite: o,
        compression: i,
        selectedVersion: c,
        keyShare: l,
        alpn: u,
        isHRR: constantTimeEqual(r, h),
        isTls13: 772 === c
    };
}

function parseServerKeyExchange(e) {
    let t = 1;
    const n = readUint16(e, t);
    t += 2;
    const r = e[t++];
    return {
        namedCurve: n,
        serverPublicKey: e.slice(t, t + r)
    };
}

function extractLeafCertificate(e, t = 0) {
    let n = 0;
    if (t) {
        const t = e[n++];
        n += t;
    }
    if (n + 3 > e.length) return null;
    const r = readUint24(e, n);
    if (n += 3, !r || n + 3 > e.length) return null;
    const a = readUint24(e, n);
    return n += 3, a ? e.slice(n, n + a) : null;
}

function parseEncryptedExtensions(e) {
    const t = {
        alpn: null
    };
    let n = 2;
    const r = 2 + readUint16(e, 0);
    for (;n + 4 <= r; ) {
        const r = readUint16(e, n);
        n += 2;
        const a = readUint16(e, n);
        if (n += 2, 16 === r && a >= 3) {
            const r = e[n + 2];
            r > 0 && n + 3 + r <= n + a && (t.alpn = textDecoder.decode(e.slice(n + 3, n + 3 + r)));
        }
        n += a;
    }
    return t;
}

function buildClientHello(e, t, n, {tls13: r = !0, tls12: a = !0, alpn: s = null, chacha: o = !0} = {}) {
    const i = [];
    r && i.push(4865, 4866, ...o ? [ 4867 ] : []), a && i.push(49199, 49200, 49195, 49196, ...o ? [ 52392, 52393 ] : []);
    const c = tlsBytes(...i.flatMap(uint16be)), l = [ tlsBytes(255, 1, 0, 1, 0) ];
    if (t) {
        const e = textEncoder.encode(t), n = tlsBytes(0, uint16be(e.length), e);
        l.push(tlsBytes(uint16be(0), uint16be(n.length + 2), uint16be(n.length), n));
    }
    l.push(tlsBytes(uint16be(11), 0, 2, 1, 0)), l.push(tlsBytes(uint16be(10), 0, 6, 0, 4, 0, 29, 0, 23));
    const u = tlsBytes(...SUPPORTED_SIGNATURE_ALGORITHMS.flatMap(uint16be));
    l.push(tlsBytes(uint16be(13), uint16be(u.length + 2), uint16be(u.length), u));
    const h = Array.isArray(s) ? s.filter(Boolean) : s ? [ s ] : [];
    if (h.length) {
        const e = concatBytes(...h.map(e => {
            const t = textEncoder.encode(e);
            return tlsBytes(t.length, t);
        }));
        l.push(tlsBytes(uint16be(16), uint16be(e.length + 2), uint16be(e.length), e));
    }
    if (r && n) {
        let e;
        if (l.push(a ? tlsBytes(uint16be(43), 0, 5, 4, 3, 4, 3, 3) : tlsBytes(uint16be(43), 0, 3, 2, 3, 4)), 
        l.push(tlsBytes(uint16be(45), 0, 2, 1, 1)), n?.x25519 && n?.p256) e = concatBytes(tlsBytes(0, 29, uint16be(n.x25519.length), n.x25519), tlsBytes(0, 23, uint16be(n.p256.length), n.p256)); else if (n?.x25519) e = tlsBytes(0, 29, uint16be(n.x25519.length), n.x25519); else if (n?.p256) e = tlsBytes(0, 23, uint16be(n.p256.length), n.p256); else {
            if (!(n instanceof Uint8Array)) throw new Error("Invalid keyShares");
            e = tlsBytes(0, 23, uint16be(n.length), n);
        }
        l.push(tlsBytes(uint16be(51), uint16be(e.length + 2), uint16be(e.length), e));
    }
    const f = concatBytes(...l);
    return buildHandshakeMessage(1, tlsBytes(uint16be(771), e, 0, uint16be(c.length), c, 1, 0, uint16be(f.length), f));
}

const uint64be = e => {
    const t = new Uint8Array(8);
    return new DataView(t.buffer).setBigUint64(0, e, !1), t;
}, xorSequenceIntoIv = (e, t) => {
    const n = e.slice(), r = uint64be(t);
    for (let e = 0; e < 8; e++) n[n.length - 8 + e] ^= r[e];
    return n;
}, deriveTrafficKeys = (e, t, n, r) => Promise.all([ hkdfExpandLabel(e, t, "key", EMPTY_BYTES, n), hkdfExpandLabel(e, t, "iv", EMPTY_BYTES, r) ]);

class TlsClient {
    constructor(e, t = {}) {
        if (this.socket = e, this.serverName = t.serverName || "", this.supportTls13 = !1 !== t.tls13, 
        this.supportTls12 = !1 !== t.tls12, !this.supportTls13 && !this.supportTls12) throw new Error("At least one TLS version must be enabled");
        this.alpnProtocols = Array.isArray(t.alpn) ? t.alpn : t.alpn ? [ t.alpn ] : null, 
        this.allowChacha = !1 !== t.allowChacha, this.timeout = t.timeout ?? 3e4, this.clientRandom = randomBytes(32), 
        this.serverRandom = null, this.handshakeChunks = [], this.handshakeComplete = !1, 
        this.negotiatedAlpn = null, this.cipherSuite = null, this.cipherConfig = null, this.isTls13 = !1, 
        this.masterSecret = null, this.handshakeSecret = null, this.clientWriteKey = null, 
        this.serverWriteKey = null, this.clientWriteIv = null, this.serverWriteIv = null, 
        this.clientHandshakeKey = null, this.serverHandshakeKey = null, this.clientHandshakeIv = null, 
        this.serverHandshakeIv = null, this.clientAppKey = null, this.serverAppKey = null, 
        this.clientAppIv = null, this.serverAppIv = null, this.clientWriteCryptoKey = null, 
        this.serverWriteCryptoKey = null, this.clientHandshakeCryptoKey = null, this.serverHandshakeCryptoKey = null, 
        this.clientAppCryptoKey = null, this.serverAppCryptoKey = null, this.clientSeqNum = 0n, 
        this.serverSeqNum = 0n, this.recordParser = new TlsRecordParser, this.handshakeParser = new TlsHandshakeParser, 
        this.keyPairs = new Map, this.ecdhKeyPair = null, this.sawCert = !1;
    }
    recordHandshake(e) {
        this.handshakeChunks.push(e);
    }
    transcript() {
        return 1 === this.handshakeChunks.length ? this.handshakeChunks[0] : concatBytes(...this.handshakeChunks);
    }
    getCipherConfig(e) {
        return CIPHER_SUITES_BY_ID.get(e) || null;
    }
    async readChunk(e) {
        return this.timeout ? Promise.race([ e.read(), new Promise((e, t) => setTimeout(() => t(new Error("TLS read timeout")), this.timeout)) ]) : e.read();
    }
    async readRecordsUntil(e, t, n) {
        for (;;) {
            let r;
            for (;r = this.recordParser.next(); ) if (await t(r)) return;
            const {value: a, done: s} = await this.readChunk(e);
            if (s) throw new Error(n);
            this.recordParser.feed(a);
        }
    }
    async readHandshakeUntil(e, t, n) {
        for (let e; e = this.handshakeParser.next(); ) if (await t(e)) return;
        return this.readRecordsUntil(e, async e => {
            if (21 === e.type) {
                if (shouldIgnoreTlsAlert(e.fragment)) return;
                throw new Error(`TLS Alert: ${e.fragment[1]}`);
            }
            if (22 === e.type) {
                this.handshakeParser.feed(e.fragment);
                for (let e; e = this.handshakeParser.next(); ) if (await t(e)) return 1;
            }
        }, n);
    }
    async acceptCertificate(e) {
        if (!e?.length) throw new Error("Empty certificate");
        this.sawCert = !0;
    }
    async handshake() {
        const [e, t] = await Promise.all([ generateKeyShare("P-256"), generateKeyShare("X25519") ]);
        this.keyPairs = new Map([ [ 23, e ], [ 29, t ] ]), this.ecdhKeyPair = e.keyPair;
        const n = this.socket.readable.getReader(), r = this.socket.writable.getWriter();
        try {
            const a = buildClientHello(this.clientRandom, this.serverName, {
                x25519: t.publicKeyRaw,
                p256: e.publicKeyRaw
            }, {
                tls13: this.supportTls13,
                tls12: this.supportTls12,
                alpn: this.alpnProtocols,
                chacha: this.allowChacha
            });
            this.recordHandshake(a), await r.write(buildTlsRecord(22, a, 769));
            const s = await this.receiveServerHello(n);
            if (s.isHRR) throw new Error("HelloRetryRequest is not supported by TLSClientMini");
            if (s.keyShare?.group && this.keyPairs.has(s.keyShare.group)) {
                const e = this.keyPairs.get(s.keyShare.group);
                this.ecdhKeyPair = e.keyPair;
            }
            s.isTls13 ? await this.handshakeTls13(n, r, s) : await this.handshakeTls12(n, r), 
            this.handshakeComplete = !0;
        } finally {
            n.releaseLock(), r.releaseLock();
        }
    }
    async receiveServerHello(e) {
        for (;;) {
            const {value: t, done: n} = await this.readChunk(e);
            if (n) throw new Error("Connection closed waiting for ServerHello");
            let r;
            for (this.recordParser.feed(t); r = this.recordParser.next(); ) {
                if (21 === r.type) {
                    if (shouldIgnoreTlsAlert(r.fragment)) continue;
                    throw new Error(`TLS Alert: level=${r.fragment[0]}, desc=${r.fragment[1]}`);
                }
                if (22 !== r.type) continue;
                let e;
                for (this.handshakeParser.feed(r.fragment); e = this.handshakeParser.next(); ) {
                    if (2 !== e.type) continue;
                    this.recordHandshake(e.raw);
                    const t = parseServerHello(e.body);
                    if (this.serverRandom = t.serverRandom, this.cipherSuite = t.cipherSuite, this.cipherConfig = this.getCipherConfig(t.cipherSuite), 
                    this.isTls13 = t.isTls13, this.negotiatedAlpn = t.alpn || null, !this.cipherConfig) throw new Error(`Unsupported cipher suite: 0x${t.cipherSuite.toString(16)}`);
                    return t;
                }
            }
        }
    }
    async handshakeTls12(e, t) {
        let n = null, r = !1;
        if (await this.readHandshakeUntil(e, async e => {
            switch (e.type) {
              case 11:
                {
                    this.recordHandshake(e.raw);
                    const t = extractLeafCertificate(e.body, 1);
                    if (!t) throw new Error("Missing TLS 1.2 certificate");
                    await this.acceptCertificate(t);
                    break;
                }

              case 12:
                this.recordHandshake(e.raw), n = parseServerKeyExchange(e.body);
                break;

              case 14:
                return this.recordHandshake(e.raw), r = !0, 1;

              case 13:
                throw new Error("Client certificate is not supported");

              default:
                this.recordHandshake(e.raw);
            }
        }, "Connection closed during TLS 1.2 handshake"), !this.sawCert) throw new Error("Missing TLS 1.2 leaf certificate");
        const a = n;
        if (!a) throw new Error("Missing TLS 1.2 ServerKeyExchange");
        const s = GROUPS_BY_ID.get(a.namedCurve);
        if (!s) throw new Error(`Unsupported named curve: 0x${a.namedCurve.toString(16)}`);
        const o = this.keyPairs.get(a.namedCurve);
        if (!o) throw new Error(`Missing key pair for curve: 0x${a.namedCurve.toString(16)}`);
        const i = await deriveSharedSecret(o.keyPair.privateKey, a.serverPublicKey, s), c = buildHandshakeMessage(16, tlsBytes(o.publicKeyRaw.length, o.publicKeyRaw));
        this.recordHandshake(c);
        const l = this.cipherConfig.hash;
        this.masterSecret = await tls12Prf(i, "master secret", concatBytes(this.clientRandom, this.serverRandom), 48, l);
        const u = this.cipherConfig.keyLen, h = this.cipherConfig.ivLen, f = await tls12Prf(this.masterSecret, "key expansion", concatBytes(this.serverRandom, this.clientRandom), 2 * u + 2 * h, l);
        this.clientWriteKey = f.slice(0, u), this.serverWriteKey = f.slice(u, 2 * u), this.clientWriteIv = f.slice(2 * u, 2 * u + h), 
        this.serverWriteIv = f.slice(2 * u + h, 2 * u + 2 * h), this.cipherConfig.chacha || ([this.clientWriteCryptoKey, this.serverWriteCryptoKey] = await Promise.all([ importAesGcmKey(this.clientWriteKey, [ "encrypt" ]), importAesGcmKey(this.serverWriteKey, [ "decrypt" ]) ])), 
        await t.write(buildTlsRecord(22, c)), await t.write(buildTlsRecord(20, tlsBytes(1)));
        const d = buildHandshakeMessage(20, await tls12Prf(this.masterSecret, "client finished", await digestBytes(l, this.transcript()), 12, l));
        this.recordHandshake(d), await t.write(buildTlsRecord(22, await this.encryptTls12(d, 22)));
        let g = !1;
        await this.readRecordsUntil(e, async e => {
            if (21 === e.type) {
                if (shouldIgnoreTlsAlert(e.fragment)) return;
                throw new Error(`TLS Alert: ${e.fragment[1]}`);
            }
            if (20 === e.type) return void (g = !0);
            if (22 !== e.type || !g) return;
            const t = await this.decryptTls12(e.fragment, 22);
            if (20 !== t[0]) return;
            const n = readUint24(t, 1), r = t.slice(4, 4 + n), a = await tls12Prf(this.masterSecret, "server finished", await digestBytes(l, this.transcript()), 12, l);
            if (!constantTimeEqual(r, a)) throw new Error("TLS 1.2 server Finished verify failed");
            return 1;
        }, "Connection closed waiting for TLS 1.2 Finished");
    }
    async handshakeTls13(e, t, n) {
        const r = GROUPS_BY_ID.get(n.keyShare?.group);
        if (!r || !n.keyShare?.key?.length) throw new Error("Missing TLS 1.3 key_share");
        const a = this.cipherConfig.hash, s = hashByteLength(a), o = this.cipherConfig.keyLen, i = this.cipherConfig.ivLen, c = await deriveSharedSecret(this.ecdhKeyPair.privateKey, n.keyShare.key, r), l = await hkdfExtract(a, null, new Uint8Array(s)), u = await hkdfExpandLabel(a, l, "derived", await digestBytes(a, EMPTY_BYTES), s);
        this.handshakeSecret = await hkdfExtract(a, u, c);
        const h = await digestBytes(a, this.transcript()), f = await hkdfExpandLabel(a, this.handshakeSecret, "c hs traffic", h, s), d = await hkdfExpandLabel(a, this.handshakeSecret, "s hs traffic", h, s);
        [this.clientHandshakeKey, this.clientHandshakeIv] = await deriveTrafficKeys(a, f, o, i), 
        [this.serverHandshakeKey, this.serverHandshakeIv] = await deriveTrafficKeys(a, d, o, i), 
        this.cipherConfig.chacha || ([this.clientHandshakeCryptoKey, this.serverHandshakeCryptoKey] = await Promise.all([ importAesGcmKey(this.clientHandshakeKey, [ "encrypt" ]), importAesGcmKey(this.serverHandshakeKey, [ "decrypt" ]) ]));
        const g = await hkdfExpandLabel(a, d, "finished", EMPTY_BYTES, s);
        let y = !1;
        const p = async e => {
            switch (e.type) {
              case 8:
                {
                    const t = parseEncryptedExtensions(e.body);
                    t.alpn && (this.negotiatedAlpn = t.alpn), this.recordHandshake(e.raw);
                    break;
                }

              case 11:
                {
                    const t = extractLeafCertificate(e.body);
                    if (!t) throw new Error("Missing TLS 1.3 certificate");
                    await this.acceptCertificate(t), this.recordHandshake(e.raw);
                    break;
                }

              case 13:
                throw new Error("Client certificate is not supported");

              case 15:
              default:
                this.recordHandshake(e.raw);
                break;

              case 20:
                {
                    const t = await hmac(a, g, await digestBytes(a, this.transcript()));
                    if (!constantTimeEqual(t, e.body)) throw new Error("TLS 1.3 server Finished verify failed");
                    this.recordHandshake(e.raw), y = !0;
                    break;
                }
            }
        };
        await this.readRecordsUntil(e, async e => {
            if (20 === e.type || 22 === e.type) return;
            if (21 === e.type) {
                if (shouldIgnoreTlsAlert(e.fragment)) return;
                throw new Error(`TLS Alert: ${e.fragment[1]}`);
            }
            if (23 !== e.type) return;
            const t = await this.decryptTls13Handshake(e.fragment), n = t[t.length - 1], r = t.slice(0, -1);
            if (22 === n) {
                this.handshakeParser.feed(r);
                for (let e; e = this.handshakeParser.next(); ) if (await p(e), y) return 1;
            }
        }, "Connection closed during TLS 1.3 handshake");
        const w = await digestBytes(a, this.transcript()), S = await hkdfExpandLabel(a, this.handshakeSecret, "derived", await digestBytes(a, EMPTY_BYTES), s), m = await hkdfExtract(a, S, new Uint8Array(s)), T = await hkdfExpandLabel(a, m, "c ap traffic", w, s), b = await hkdfExpandLabel(a, m, "s ap traffic", w, s);
        [this.clientAppKey, this.clientAppIv] = await deriveTrafficKeys(a, T, o, i), [this.serverAppKey, this.serverAppIv] = await deriveTrafficKeys(a, b, o, i), 
        this.cipherConfig.chacha || ([this.clientAppCryptoKey, this.serverAppCryptoKey] = await Promise.all([ importAesGcmKey(this.clientAppKey, [ "encrypt" ]), importAesGcmKey(this.serverAppKey, [ "decrypt" ]) ]));
        const C = await hkdfExpandLabel(a, f, "finished", EMPTY_BYTES, s), A = buildHandshakeMessage(20, await hmac(a, C, await digestBytes(a, this.transcript())));
        this.recordHandshake(A), await t.write(buildTlsRecord(23, await this.encryptTls13Handshake(concatBytes(A, [ 22 ])))), 
        this.clientSeqNum = 0n, this.serverSeqNum = 0n;
    }
    async encryptTls12(e, t) {
        const n = this.clientSeqNum++, r = uint64be(n), a = concatBytes(r, [ t ], uint16be(771), uint16be(e.length));
        if (this.cipherConfig.chacha) {
            const t = xorSequenceIntoIv(this.clientWriteIv, n);
            return chacha20Poly1305Encrypt(this.clientWriteKey, t, e, a);
        }
        const s = randomBytes(8);
        return this.clientWriteCryptoKey || (this.clientWriteCryptoKey = await importAesGcmKey(this.clientWriteKey, [ "encrypt" ])), 
        concatBytes(s, await aesGcmEncryptWithKey(this.clientWriteCryptoKey, concatBytes(this.clientWriteIv, s), e, a));
    }
    async decryptTls12(e, t) {
        const n = this.serverSeqNum++, r = uint64be(n);
        if (this.cipherConfig.chacha) {
            const a = xorSequenceIntoIv(this.serverWriteIv, n);
            return chacha20Poly1305Decrypt(this.serverWriteKey, a, e, concatBytes(r, [ t ], uint16be(771), uint16be(e.length - 16)));
        }
        const a = e.subarray(0, 8), s = e.subarray(8);
        return this.serverWriteCryptoKey || (this.serverWriteCryptoKey = await importAesGcmKey(this.serverWriteKey, [ "decrypt" ])), 
        aesGcmDecryptWithKey(this.serverWriteCryptoKey, concatBytes(this.serverWriteIv, a), s, concatBytes(r, [ t ], uint16be(771), uint16be(s.length - 16)));
    }
    async encryptTls13Handshake(e) {
        const t = xorSequenceIntoIv(this.clientHandshakeIv, this.clientSeqNum++), n = tlsBytes(23, 3, 3, uint16be(e.length + 16));
        return this.cipherConfig.chacha ? chacha20Poly1305Encrypt(this.clientHandshakeKey, t, e, n) : (this.clientHandshakeCryptoKey || (this.clientHandshakeCryptoKey = await importAesGcmKey(this.clientHandshakeKey, [ "encrypt" ])), 
        aesGcmEncryptWithKey(this.clientHandshakeCryptoKey, t, e, n));
    }
    async decryptTls13Handshake(e) {
        const t = xorSequenceIntoIv(this.serverHandshakeIv, this.serverSeqNum++), n = tlsBytes(23, 3, 3, uint16be(e.length)), r = this.cipherConfig.chacha ? await chacha20Poly1305Decrypt(this.serverHandshakeKey, t, e, n) : await aesGcmDecryptWithKey(this.serverHandshakeCryptoKey || (this.serverHandshakeCryptoKey = await importAesGcmKey(this.serverHandshakeKey, [ "decrypt" ])), t, e, n);
        let a = r.length - 1;
        for (;a >= 0 && !r[a]; ) a--;
        return a < 0 ? EMPTY_BYTES : r.slice(0, a + 1);
    }
    async encryptTls13(e) {
        const t = concatBytes(e, [ 23 ]), n = xorSequenceIntoIv(this.clientAppIv, this.clientSeqNum++), r = tlsBytes(23, 3, 3, uint16be(t.length + 16));
        return this.cipherConfig.chacha ? chacha20Poly1305Encrypt(this.clientAppKey, n, t, r) : (this.clientAppCryptoKey || (this.clientAppCryptoKey = await importAesGcmKey(this.clientAppKey, [ "encrypt" ])), 
        aesGcmEncryptWithKey(this.clientAppCryptoKey, n, t, r));
    }
    async decryptTls13(e) {
        const t = xorSequenceIntoIv(this.serverAppIv, this.serverSeqNum++), n = tlsBytes(23, 3, 3, uint16be(e.length)), r = this.cipherConfig.chacha ? await chacha20Poly1305Decrypt(this.serverAppKey, t, e, n) : await aesGcmDecryptWithKey(this.serverAppCryptoKey || (this.serverAppCryptoKey = await importAesGcmKey(this.serverAppKey, [ "decrypt" ])), t, e, n);
        let a = r.length - 1;
        for (;a >= 0 && !r[a]; ) a--;
        return a < 0 ? {
            data: EMPTY_BYTES,
            type: 0
        } : {
            data: r.slice(0, a),
            type: r[a]
        };
    }
    async write(e) {
        if (!this.handshakeComplete) throw new Error("Handshake not complete");
        const t = 数据转Uint8Array(e);
        if (!t.byteLength) return;
        const n = this.socket.writable.getWriter();
        try {
            const e = [];
            for (let n = 0; n < t.byteLength; n += 16384) {
                const r = t.subarray(n, Math.min(n + 16384, t.byteLength)), a = this.isTls13 ? await this.encryptTls13(r) : await this.encryptTls12(r, 23);
                e.push(buildTlsRecord(23, a));
            }
            await n.write(1 === e.length ? e[0] : concatBytes(...e));
        } finally {
            n.releaseLock();
        }
    }
    async read() {
        for (;;) {
            let e;
            for (;e = this.recordParser.next(); ) {
                if (21 === e.type) {
                    if (0 === e.fragment[1]) return null;
                    throw new Error(`TLS Alert: ${e.fragment[1]}`);
                }
                if (23 !== e.type) continue;
                if (!this.isTls13) return this.decryptTls12(e.fragment, 23);
                const {data: t, type: n} = await this.decryptTls13(e.fragment);
                if (23 === n) return t;
                if (21 === n) {
                    if (0 === t[1]) return null;
                    throw new Error(`TLS Alert: ${t[1]}`);
                }
                if (22 !== n) continue;
                let r;
                for (this.handshakeParser.feed(t); r = this.handshakeParser.next(); ) if (4 !== r.type && 24 === r.type) throw new Error("TLS 1.3 KeyUpdate is not supported by TLSClientMini");
            }
            const t = this.socket.readable.getReader();
            try {
                const {value: e, done: n} = await this.readChunk(t);
                if (n) return null;
                this.recordParser.feed(e);
            } finally {
                t.releaseLock();
            }
        }
    }
    close() {
        this.socket.close();
    }
}

function stripIPv6Brackets(e = "") {
    const t = String(e || "").trim();
    return t.startsWith("[") && t.endsWith("]") ? t.slice(1, -1) : t;
}

function isIPHostname(e = "") {
    const t = stripIPv6Brackets(e);
    if (/^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/.test(t)) return !0;
    if (!t.includes(":")) return !1;
    try {
        return new URL(`http://[${t}]/`), !0;
    } catch (e) {
        return !1;
    }
}

const CONNECT_TIMEOUT_MS = 9999, TURN_STUN_MAGIC_COOKIE = new Uint8Array([ 33, 18, 164, 66 ]), TURN_STUN_TYPE = {
    ALLOCATE_REQUEST: 3,
    ALLOCATE_SUCCESS: 259,
    ALLOCATE_ERROR: 275,
    CREATE_PERMISSION_REQUEST: 8,
    CREATE_PERMISSION_SUCCESS: 264,
    CONNECT_REQUEST: 10,
    CONNECT_SUCCESS: 266,
    CONNECTION_BIND_REQUEST: 11,
    CONNECTION_BIND_SUCCESS: 267
}, TURN_STUN_ATTR = {
    USERNAME: 6,
    MESSAGE_INTEGRITY: 8,
    ERROR_CODE: 9,
    XOR_PEER_ADDRESS: 18,
    REALM: 20,
    NONCE: 21,
    REQUESTED_TRANSPORT: 25,
    CONNECTION_ID: 42
};

async function withTimeout(e, t, n) {
    let r;
    try {
        return await Promise.race([ e, new Promise((e, a) => {
            r = setTimeout(() => a(new Error(n)), t);
        }) ]);
    } finally {
        clearTimeout(r);
    }
}

function isIPv4(e) {
    const t = String(e || "").split(".");
    return 4 === t.length && t.every(e => /^\d{1,3}$/.test(e) && Number(e) >= 0 && Number(e) <= 255);
}

function turnStunPadding(e) {
    return 3 & -e;
}

function createTurnStunAttribute(e, t) {
    const n = 数据转Uint8Array(t), r = new Uint8Array(4 + n.byteLength + turnStunPadding(n.byteLength)), a = new DataView(r.buffer);
    return a.setUint16(0, e), a.setUint16(2, n.byteLength), r.set(n, 4), r;
}

function createTurnStunMessage(e, t, n) {
    const r = 拼接字节数据(...n), a = new Uint8Array(20), s = new DataView(a.buffer);
    return s.setUint16(0, e), s.setUint16(2, r.byteLength), a.set(TURN_STUN_MAGIC_COOKIE, 4), 
    a.set(t, 8), 拼接字节数据(a, r);
}

function parseTurnErrorCode(e) {
    return e?.byteLength >= 4 ? 100 * (7 & e[2]) + e[3] : 0;
}

function randomTurnTransactionId() {
    return crypto.getRandomValues(new Uint8Array(12));
}

async function addTurnMessageIntegrity(e, t) {
    const n = new Uint8Array(e), r = new DataView(n.buffer);
    r.setUint16(2, r.getUint16(2) + 24);
    const a = await crypto.subtle.importKey("raw", t, {
        name: "HMAC",
        hash: "SHA-1"
    }, !1, [ "sign" ]), s = await crypto.subtle.sign("HMAC", a, n);
    return 拼接字节数据(n, createTurnStunAttribute(TURN_STUN_ATTR.MESSAGE_INTEGRITY, new Uint8Array(s)));
}

async function readTurnStunMessage(e, t = null, n = "TURN response timed out") {
    let r = 有效数据长度(t) ? 数据转Uint8Array(t) : new Uint8Array(0);
    const a = async () => {
        const {done: t, value: a} = await withTimeout(e.read(), CONNECT_TIMEOUT_MS, n);
        if (t) throw new Error("TURN server closed connection");
        a?.byteLength && (r = 拼接字节数据(r, a));
    };
    for (;r.byteLength < 20; ) await a();
    const s = 20 + (r[2] << 8 | r[3]);
    if (s > 65555) throw new Error("TURN response is too large");
    for (;r.byteLength < s; ) await a();
    const o = r.subarray(0, s);
    if (TURN_STUN_MAGIC_COOKIE.some((e, t) => o[4 + t] !== e)) throw new Error("Invalid TURN/STUN response");
    const i = new DataView(o.buffer, o.byteOffset, o.byteLength), c = {};
    for (let e = 20; e + 4 <= s; ) {
        const t = i.getUint16(e), n = i.getUint16(e + 2);
        if (e + 4 + n > o.byteLength) break;
        c[t] = o.slice(e + 4, e + 4 + n), e += 4 + n + turnStunPadding(n);
    }
    return {
        message: {
            type: i.getUint16(0),
            attributes: c
        },
        extraData: r.byteLength > s ? r.subarray(s) : null
    };
}

async function writeTurnBytes(e, t, n) {
    await withTimeout(e.write(t), CONNECT_TIMEOUT_MS, n);
}

async function turnConnect(e, t, n, r) {
    e = {
        ...e,
        username: e.username ?? null,
        password: e.password ?? null
    };
    const a = stripIPv6Brackets(t);
    let s = isIPv4(a) ? a : null;
    if (!s) {
        const e = await DoH查询(a, "A"), t = e.find(e => 1 === e.type && isIPv4(e.data))?.data;
        s = "string" == typeof t ? t : null;
    }
    if (!s) throw new Error(`Could not resolve ${t} to an IPv4 address for TURN CONNECT`);
    const o = stripIPv6Brackets(e.hostname);
    let i = null, c = null, l = null, u = null, h = null, f = null, d = !1;
    const g = () => {
        try {
            i?.close?.();
        } catch (e) {}
        try {
            c?.close?.();
        } catch (e) {}
    }, y = () => {
        if (!d) {
            d = !0;
            try {
                f?.releaseLock?.();
            } catch (e) {}
        }
    };
    try {
        i = r({
            hostname: o,
            port: e.port
        }), await withTimeout(i.opened, CONNECT_TIMEOUT_MS, "TURN server connection timed out"), 
        l = i.writable.getWriter(), u = i.readable.getReader();
        const t = new Uint8Array(8);
        t[1] = 1, new DataView(t.buffer).setUint16(2, 8466 ^ n), s.split(".").forEach((e, n) => {
            t[4 + n] = Number(e) ^ TURN_STUN_MAGIC_COOKIE[n];
        });
        const a = createTurnStunAttribute(TURN_STUN_ATTR.XOR_PEER_ADDRESS, t), d = new Uint8Array([ 6, 0, 0, 0 ]);
        await writeTurnBytes(l, createTurnStunMessage(TURN_STUN_TYPE.ALLOCATE_REQUEST, randomTurnTransactionId(), [ createTurnStunAttribute(TURN_STUN_ATTR.REQUESTED_TRANSPORT, d) ]), "TURN Allocate request timed out");
        let p = await readTurnStunMessage(u, null, "TURN Allocate response timed out"), w = p.message, S = p.extraData, m = null, T = [];
        const b = e => m ? addTurnMessageIntegrity(e, m) : Promise.resolve(e);
        if (w.type === TURN_STUN_TYPE.ALLOCATE_ERROR && null !== e.username && null !== e.password && 401 === parseTurnErrorCode(w.attributes[TURN_STUN_ATTR.ERROR_CODE])) {
            const t = w.attributes[TURN_STUN_ATTR.REALM], n = w.attributes[TURN_STUN_ATTR.NONCE];
            if (!t || !n?.byteLength) throw new Error("TURN authentication challenge is missing realm or nonce");
            const r = textDecoder.decode(t);
            m = new Uint8Array(await crypto.subtle.digest("MD5", textEncoder.encode(`${e.username}:${r}:${e.password}`))), 
            T = [ createTurnStunAttribute(TURN_STUN_ATTR.USERNAME, textEncoder.encode(e.username)), createTurnStunAttribute(TURN_STUN_ATTR.REALM, textEncoder.encode(r)), createTurnStunAttribute(TURN_STUN_ATTR.NONCE, n) ];
            const s = await addTurnMessageIntegrity(createTurnStunMessage(TURN_STUN_TYPE.ALLOCATE_REQUEST, randomTurnTransactionId(), [ createTurnStunAttribute(TURN_STUN_ATTR.REQUESTED_TRANSPORT, d), ...T ]), m), o = await Promise.all([ b(createTurnStunMessage(TURN_STUN_TYPE.CREATE_PERMISSION_REQUEST, randomTurnTransactionId(), [ a, ...T ])), b(createTurnStunMessage(TURN_STUN_TYPE.CONNECT_REQUEST, randomTurnTransactionId(), [ a, ...T ])) ]);
            await writeTurnBytes(l, 拼接字节数据(s, ...o), "TURN authenticated Allocate request timed out"), 
            p = await readTurnStunMessage(u, S, "TURN authenticated Allocate response timed out"), 
            w = p.message, S = p.extraData;
        } else if (w.type === TURN_STUN_TYPE.ALLOCATE_SUCCESS) {
            const e = await Promise.all([ b(createTurnStunMessage(TURN_STUN_TYPE.CREATE_PERMISSION_REQUEST, randomTurnTransactionId(), [ a, ...T ])), b(createTurnStunMessage(TURN_STUN_TYPE.CONNECT_REQUEST, randomTurnTransactionId(), [ a, ...T ])) ]);
            e.length && await writeTurnBytes(l, 拼接字节数据(...e), "TURN pipelined request timed out");
        }
        if (w.type !== TURN_STUN_TYPE.ALLOCATE_SUCCESS) {
            const e = parseTurnErrorCode(w.attributes[TURN_STUN_ATTR.ERROR_CODE]);
            throw new Error(e ? `TURN Allocate failed with ${e}` : "TURN Allocate failed");
        }
        if (c = r({
            hostname: o,
            port: e.port
        }), p = await readTurnStunMessage(u, S, "TURN CreatePermission response timed out"), 
        w = p.message, S = p.extraData, w.type !== TURN_STUN_TYPE.CREATE_PERMISSION_SUCCESS) throw new Error("TURN CreatePermission failed");
        if (p = await readTurnStunMessage(u, S, "TURN CONNECT response timed out"), w = p.message, 
        S = p.extraData, w.type !== TURN_STUN_TYPE.CONNECT_SUCCESS || !w.attributes[TURN_STUN_ATTR.CONNECTION_ID]) throw new Error("TURN CONNECT failed");
        await withTimeout(c.opened, CONNECT_TIMEOUT_MS, "TURN data connection timed out"), 
        h = c.writable.getWriter(), f = c.readable.getReader(), await writeTurnBytes(h, await b(createTurnStunMessage(TURN_STUN_TYPE.CONNECTION_BIND_REQUEST, randomTurnTransactionId(), [ createTurnStunAttribute(TURN_STUN_ATTR.CONNECTION_ID, w.attributes[TURN_STUN_ATTR.CONNECTION_ID]), ...T ])), "TURN ConnectionBind request timed out"), 
        p = await readTurnStunMessage(f, null, "TURN ConnectionBind response timed out"), 
        w = p.message;
        const C = p.extraData;
        if (w.type !== TURN_STUN_TYPE.CONNECTION_BIND_SUCCESS) throw new Error("TURN ConnectionBind failed");
        l.releaseLock(), l = null, u.releaseLock(), u = null, h.releaseLock(), h = null;
        return {
            readable: new ReadableStream({
                start(e) {
                    C?.byteLength && e.enqueue(C);
                },
                pull: e => f.read().then(({done: t, value: n}) => {
                    t ? (y(), e.close()) : n?.byteLength && e.enqueue(new Uint8Array(n));
                }),
                cancel() {
                    try {
                        f?.cancel?.();
                    } catch (e) {}
                    y(), g();
                }
            }),
            writable: c.writable,
            closed: c.closed,
            close: g
        };
    } catch (e) {
        try {
            l?.releaseLock?.();
        } catch (e) {}
        try {
            u?.releaseLock?.();
        } catch (e) {}
        try {
            h?.releaseLock?.();
        } catch (e) {}
        throw y(), g(), e;
    }
}

const SSTP_TCP_MSS = 1400, SSTP_EMPTY_BYTES = new Uint8Array(0);

function readSstpUint16(e, t = 0) {
    return e[t] << 8 | e[t + 1];
}

function readSstpUint32(e, t = 0) {
    return (e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3]) >>> 0;
}

function randomSstpUint16() {
    return readSstpUint16(crypto.getRandomValues(new Uint8Array(2)));
}

function internetChecksum(e, t, n) {
    let r = 0;
    for (let a = t; a < t + n - 1; a += 2) r += readSstpUint16(e, a);
    for (1 & n && (r += e[t + n - 1] << 8); r >> 16; ) r = (65535 & r) + (r >> 16);
    return 65535 & ~r;
}

async function sstpConnect(e, t, n, r) {
    e = {
        ...e,
        username: e.username ?? null,
        password: e.password ?? null
    };
    let a, s, o = SSTP_EMPTY_BYTES, i = 1, c = null, l = null, u = null, h = !1;
    const f = new Promise((e, t) => {
        a = e, s = t;
    }), d = (e, t) => {
        h || (h = !0, e(t));
    }, g = () => {
        try {
            l?.cancel?.().catch?.(() => {});
        } catch (e) {}
        try {
            l?.releaseLock?.();
        } catch (e) {}
        try {
            u?.close?.().catch?.(() => {});
        } catch (e) {}
        try {
            u?.releaseLock?.();
        } catch (e) {}
        try {
            c?.close?.();
        } catch (e) {}
        d(a);
    }, y = async () => {
        const {value: e, done: t} = await l.read();
        if (t || !e) throw new Error("SSTP socket closed");
        return 数据转Uint8Array(e);
    }, p = async e => {
        for (;o.byteLength < e; ) {
            const e = await y();
            o = o.byteLength ? 拼接字节数据(o, e) : e;
        }
        const t = o.subarray(0, e);
        return o = o.subarray(e), t;
    }, w = async () => {
        for (;;) {
            const e = o.indexOf(10);
            if (e >= 0) {
                const t = textDecoder.decode(o.subarray(0, e));
                return o = o.subarray(e + 1), t.replace(/\r$/, "");
            }
            const t = await y();
            o = o.byteLength ? 拼接字节数据(o, t) : t;
        }
    }, S = async (e = CONNECT_TIMEOUT_MS) => {
        const t = await withTimeout(p(4), e, "SSTP read timeout"), n = 4095 & readSstpUint16(t, 2);
        if (n < 4) throw new Error("Invalid SSTP packet length");
        return {
            isControl: !!(1 & t[1]),
            body: n > 4 ? await withTimeout(p(n - 4), e, "SSTP packet body read timeout") : SSTP_EMPTY_BYTES
        };
    }, m = e => {
        const t = 6 + e.byteLength, n = new Uint8Array(t);
        return n.set([ 16, 0, t >> 8 & 15 | 128, 255 & t, 255, 3 ]), n.set(e, 6), n;
    }, T = (e, t, n, r = []) => {
        const a = r.reduce((e, t) => e + 2 + t.data.byteLength, 0), s = new Uint8Array(6 + a), o = new DataView(s.buffer);
        return o.setUint16(0, e), s[2] = t, s[3] = n, o.setUint16(4, 4 + a), r.reduce((e, t) => (s[e] = t.type, 
        s[e + 1] = 2 + t.data.byteLength, s.set(t.data, e + 2), e + 2 + t.data.byteLength), 6), 
        s;
    }, b = e => {
        const t = e.byteLength >= 2 && 255 === e[0] && 3 === e[1] ? 2 : 0;
        if (e.byteLength - t < 4) return null;
        const n = readSstpUint16(e, t);
        return 33 === n ? {
            protocol: n,
            ipPacket: e.subarray(t + 2)
        } : e.byteLength - t < 6 ? null : {
            protocol: n,
            code: e[t + 2],
            id: e[t + 3],
            payload: e.subarray(t + 6),
            rawPacket: e.subarray(t)
        };
    }, C = e => {
        const t = [];
        for (let n = 0; n + 2 <= e.byteLength; ) {
            const r = e[n], a = e[n + 1];
            if (a < 2 || n + a > e.byteLength) break;
            t.push({
                type: r,
                data: e.subarray(n + 2, n + a)
            }), n += a;
        }
        return t;
    };
    try {
        const a = stripIPv6Brackets(e.hostname), h = e.port;
        c = r({
            hostname: a,
            port: h
        }, {
            secureTransport: "on",
            allowHalfOpen: !1
        }), await withTimeout(c.opened, CONNECT_TIMEOUT_MS, "SSTP server connection timed out"), 
        l = c.readable.getReader(), u = c.writable.getWriter();
        const y = a.includes(":") ? `[${a}]` : a, p = textEncoder.encode(`SSTP_DUPLEX_POST /sra_{BA195980-CD49-458b-9E23-C84EE0ADCD75}/ HTTP/1.1\r\nHost: ${443 === Number(h) ? y : `${y}:${h}`}\r\nContent-Length: 18446744073709551615\r\nSSTPCORRELATIONID: {${crypto.randomUUID()}}\r\n\r\n`), A = new Uint8Array(2);
        new DataView(A.buffer).setUint16(0, 1);
        const E = new Uint8Array(2);
        new DataView(E.buffer).setUint16(0, 1500);
        const U = new Uint8Array(12 + A.byteLength), P = new DataView(U.buffer);
        U[0] = 16, U[1] = 1, P.setUint16(2, 32768 | U.byteLength), P.setUint16(4, 1), P.setUint16(6, 1), 
        U[9] = 1, P.setUint16(10, 4 + A.byteLength), U.set(A, 12), await withTimeout(u.write(拼接字节数据(p, U, m(T(49185, 1, i++, [ {
            type: 1,
            data: E
        } ])))), CONNECT_TIMEOUT_MS, "SSTP HTTP handshake request timed out");
        const N = await withTimeout(w(), CONNECT_TIMEOUT_MS, "SSTP HTTP handshake timed out");
        for (;;) {
            if ("" === await withTimeout(w(), CONNECT_TIMEOUT_MS, "SSTP HTTP header read timed out")) break;
        }
        if (!/HTTP\/\d(?:\.\d)?\s+2\d\d/i.test(N)) throw new Error(`SSTP HTTP handshake failed: ${N || "invalid status"}`);
        let _ = !1, k = !1, L = !1, O = !1, $ = !1, I = !1, v = !1, R = null;
        const D = async () => {
            if (!_ || !k || !L || O) return;
            if (null === e.username || null === e.password) throw new Error("SSTP server requires PAP authentication");
            const t = textEncoder.encode(e.username), n = textEncoder.encode(e.password);
            if (t.byteLength > 255 || n.byteLength > 255) throw new Error("SSTP username/password is too long");
            const r = 6 + t.byteLength + n.byteLength, a = new Uint8Array(2 + r), s = new DataView(a.buffer);
            s.setUint16(0, 49187), a[2] = 1, a[3] = i++, s.setUint16(4, r), a[6] = t.byteLength, 
            a.set(t, 7), a[7 + t.byteLength] = n.byteLength, a.set(n, 8 + t.byteLength), await withTimeout(u.write(m(a)), CONNECT_TIMEOUT_MS, "SSTP PAP authentication request timed out"), 
            O = !0;
        }, x = async () => {
            !_ || !k || I || L && !$ || (await withTimeout(u.write(m(T(32801, 1, i++, [ {
                type: 3,
                data: new Uint8Array(4)
            } ]))), CONNECT_TIMEOUT_MS, "SSTP IPCP request timed out"), I = !0);
        };
        for (let e = 0; e < 50 && !v; e++) {
            const e = await S(CONNECT_TIMEOUT_MS);
            if (e.isControl) continue;
            const t = b(e.body);
            if (t) if (49185 !== t.protocol) {
                if (49187 !== t.protocol) {
                    if (32801 === t.protocol) if (1 === t.code) {
                        const e = new Uint8Array(t.rawPacket);
                        e[2] = 2, await withTimeout(u.write(m(e)), CONNECT_TIMEOUT_MS, "SSTP IPCP Configure-Ack timed out"), 
                        await x();
                    } else if (3 === t.code) {
                        const e = C(t.payload).find(e => 3 === e.type);
                        4 === e?.data?.byteLength && (R = [ ...e.data ].join("."), await withTimeout(u.write(m(T(32801, 1, i++, [ {
                            type: 3,
                            data: e.data
                        } ]))), CONNECT_TIMEOUT_MS, "SSTP IPCP address request timed out"), I = !0);
                    } else if (2 === t.code) {
                        const e = C(t.payload).find(e => 3 === e.type);
                        4 === e?.data?.byteLength && (R = [ ...e.data ].join(".")), v = !0;
                    }
                } else if (2 === t.code) $ = !0, await x(); else if (3 === t.code) throw new Error("SSTP PAP authentication failed");
            } else if (1 === t.code) {
                const e = C(t.payload).find(e => 3 === e.type);
                if (e?.data?.byteLength >= 2) {
                    const t = readSstpUint16(e.data);
                    if (49187 !== t) throw new Error(`SSTP unsupported PPP authentication protocol: 0x${t.toString(16)}`);
                    L = !0;
                }
                const n = new Uint8Array(t.rawPacket);
                n[2] = 2, await withTimeout(u.write(m(n)), CONNECT_TIMEOUT_MS, "SSTP LCP Configure-Ack timed out"), 
                k = !0, await D(), await x();
            } else 2 === t.code && (_ = !0, await D(), await x());
        }
        if (!R) throw new Error("SSTP did not assign an IPv4 address");
        const H = stripIPv6Brackets(t);
        let M = isIPv4(H) ? H : null;
        if (!M) {
            const e = await DoH查询(H, "A"), t = e.find(e => 1 === e.type && isIPv4(e.data))?.data;
            M = "string" == typeof t ? t : null;
        }
        if (!M) throw new Error(`Could not resolve ${t} to an IPv4 address for SSTP`);
        const K = 1e4 + randomSstpUint16() % 5e4, J = new Uint8Array(String(R || "").split(".").map(Number)), B = new Uint8Array(String(M || "").split(".").map(Number));
        let j = readSstpUint32(crypto.getRandomValues(new Uint8Array(4))), W = 0;
        const G = new Uint8Array(20);
        G.set([ 69, 0, 0, 0, 0, 0, 64, 0, 64, 6 ]), G.set(J, 12), G.set(B, 16);
        const q = new Uint8Array(1432);
        q.set(J), q.set(B, 4), q[9] = 6;
        const Y = (e, t = SSTP_EMPTY_BYTES) => {
            const r = 数据转Uint8Array(t), a = r.byteLength, s = 20 + a, o = 20 + s, i = 8 + o, c = new Uint8Array(i), l = new DataView(c.buffer);
            return c.set([ 16, 0, i >> 8 & 15 | 128, 255 & i, 255, 3, 0, 33 ]), c.set(G, 8), 
            l.setUint16(10, o), l.setUint16(12, randomSstpUint16()), l.setUint16(18, internetChecksum(c, 8, 20)), 
            l.setUint16(28, K), l.setUint16(30, n), l.setUint32(32, j), l.setUint32(36, W), 
            c[40] = 80, c[41] = e, l.setUint16(42, 65535), a && c.set(r, 48), q[10] = s >> 8, 
            q[11] = 255 & s, q.set(c.subarray(28, 28 + s), 12), l.setUint16(44, internetChecksum(q, 0, 12 + s)), 
            c;
        }, F = e => {
            if (e.byteLength < 40 || 6 !== e[9]) return null;
            const t = 4 * (15 & e[0]);
            return e.byteLength < t + 20 || readSstpUint16(e, t) !== n || readSstpUint16(e, t + 2) !== K ? null : {
                flags: e[t + 13],
                sequence: readSstpUint32(e, t + 4),
                payloadOffset: t + 4 * (e[t + 12] >> 4 & 15)
            };
        };
        await withTimeout(u.write(Y(2)), CONNECT_TIMEOUT_MS, "SSTP TCP SYN write timed out"), 
        j = j + 1 >>> 0;
        let V = !1;
        for (let e = 0; e < 30; e++) {
            const e = await S(CONNECT_TIMEOUT_MS);
            if (e.isControl) continue;
            const t = b(e.body);
            if (!t || 33 !== t.protocol) continue;
            const n = F(t.ipPacket);
            if (n && !(18 & ~n.flags)) {
                W = n.sequence + 1 >>> 0, await withTimeout(u.write(Y(16)), CONNECT_TIMEOUT_MS, "SSTP TCP ACK write timed out"), 
                V = !0;
                break;
            }
        }
        if (!V) throw new Error("TCP handshake through SSTP timed out");
        let X = null;
        const Q = new ReadableStream({
            start(e) {
                X = e;
            },
            cancel() {
                g();
            }
        });
        (async () => {
            try {
                let e = [], t = 0;
                const n = () => {
                    if (t) {
                        if (!X) throw new Error("SSTP readable stream is not ready");
                        X.enqueue(1 === e.length ? e[0] : 拼接字节数据(...e)), e = [], t = 0, u.write(Y(16)).catch(() => {});
                    }
                };
                for (;;) {
                    const r = await S(6e4);
                    if (r.isControl) continue;
                    const a = b(r.body);
                    if (!a || 33 !== a.protocol) continue;
                    const s = F(a.ipPacket);
                    if (s) {
                        if (s.payloadOffset < a.ipPacket.byteLength) {
                            const n = a.ipPacket.subarray(s.payloadOffset);
                            n.byteLength && (W = s.sequence + n.byteLength >>> 0, e.push(new Uint8Array(n)), 
                            t += n.byteLength);
                        }
                        if (1 & s.flags) {
                            n(), W = W + 1 >>> 0, u.write(Y(17)).catch(() => {});
                            const e = X;
                            if (e) try {
                                e.close();
                            } catch (e) {}
                            return void g();
                        }
                        (o.byteLength < 4 || t >= 32768) && n();
                    }
                }
            } catch (e) {
                const t = X;
                if (t) try {
                    t.error(e);
                } catch (e) {}
                d(s, e);
                try {
                    c?.close?.();
                } catch (e) {}
            }
        })();
        return {
            readable: Q,
            writable: new WritableStream({
                async write(e) {
                    const t = 数据转Uint8Array(e);
                    if (!t.byteLength) return;
                    if (t.byteLength <= SSTP_TCP_MSS) return await u.write(Y(24, t)), void (j = j + t.byteLength >>> 0);
                    const n = [];
                    for (let e = 0; e < t.byteLength; e += SSTP_TCP_MSS) {
                        const r = t.subarray(e, Math.min(e + SSTP_TCP_MSS, t.byteLength));
                        n.push(Y(24, r)), j = j + r.byteLength >>> 0;
                    }
                    await u.write(拼接字节数据(...n));
                },
                close: () => u.write(Y(17)).catch(() => {}),
                abort(e) {
                    g(), e && d(s, e);
                }
            }),
            closed: f,
            close: g
        };
    } catch (e) {
        throw g(), e;
    }
}

function base64SecretEncode(e, t) {
    const n = new TextEncoder, r = n.encode(e), a = n.encode(t), s = new Uint8Array(r.length);
    for (let e = 0; e < r.length; e++) s[e] = r[e] ^ a[e % a.length];
    let o = "";
    for (let e = 0; e < s.length; e++) o += String.fromCharCode(s[e]);
    return btoa(o);
}

function base64SecretDecode(e, t) {
    const n = atob(e), r = new Uint8Array(n.length);
    for (let e = 0; e < n.length; e++) r[e] = n.charCodeAt(e);
    const a = (new TextEncoder).encode(t), s = new Uint8Array(r.length);
    for (let e = 0; e < r.length; e++) s[e] = r[e] ^ a[e % a.length];
    return (new TextDecoder).decode(s);
}

function 获取传输协议配置(e = {}) {
    const t = "grpc" === e.传输协议, {"头": n, "键": r} = 获取叉HTTPPadding标识(e.UUID), a = {
        xPaddingObfsMode: !0,
        xPaddingMethod: "tokenish",
        xPaddingPlacement: "queryInHeader",
        xPaddingHeader: n,
        xPaddingKey: r
    };
    return {
        type: t ? "multi" === e.gRPC模式 ? "grpc&mode=multi" : "grpc&mode=gun" : "xhttp" === e.传输协议 ? `xhttp&mode=stream-one&extra=${encodeURIComponent(JSON.stringify(a))}` : "ws",
        "路径字段名": t ? "serviceName" : "path",
        "域名字段名": t ? "authority" : "host"
    };
}

function 获取传输路径参数值(e = {}, t = "/", n = !1) {
    const r = n ? "/" : e.随机路径 ? 随机路径(t) : t;
    return "grpc" !== e.传输协议 ? r : r.split("?")[0] || "/";
}

function log(...e) {
    调试日志打印 && console.log(...e);
}

function Clash订阅配置文件热补丁(e, t = {}) {
    const n = t?.UUID || null, r = Boolean(t?.ECH), a = Array.isArray(t?.HOSTS) ? [ ...t.HOSTS ] : [], s = t?.ECHConfig?.SNI || null, o = t?.ECHConfig?.DNS, i = Boolean(n && r), c = "string" == typeof t?.gRPCUserAgent && t.gRPCUserAgent.trim() ? t.gRPCUserAgent.trim() : null, l = "grpc" === t?.传输协议 && Boolean(c), u = c ? JSON.stringify(c) : null;
    let h = e.replace(/mode:\s*Rule\b/g, "mode: rule");
    const f = e => e.replace(/grpc-opts:\s*\{([\s\S]*?)\}/i, (e, t) => {
        if (/grpc-user-agent\s*:/i.test(t)) return e;
        let n = t.trim();
        n.endsWith(",") && (n = n.slice(0, -1).trim());
        return `grpc-opts: {${n ? `${n}, grpc-user-agent: ${u}` : `grpc-user-agent: ${u}`}}`;
    }), d = e => /(?:^|[,{])\s*network:\s*(?:"grpc"|'grpc'|grpc)(?=\s*(?:[,}\n#]|$))/im.test(e), g = (e, t) => {
        const n = "trojan" === (e => e.match(/type:\s*(\w+)/)?.[1] || "vless")(e) ? "password" : "uuid", r = new RegExp(`${n}:\\s*${t ? "([^,}\\n]+)" : "([^\\n]+)"}`);
        return e.match(r)?.[1]?.trim() || null;
    }, y = e => !d(e) || /grpc-user-agent\s*:/i.test(e) ? e : /grpc-opts:\s*\{/i.test(e) ? f(e) : e.replace(/\}(\s*)$/, `, grpc-opts: {grpc-user-agent: ${u}}}$1`), p = (e, t) => {
        const n = " ".repeat(t);
        let r = -1;
        for (let n = 0; n < e.length; n++) {
            const a = e[n];
            if (!a.trim()) continue;
            if (a.search(/\S/) === t && (/^\s*grpc-opts:\s*(?:#.*)?$/.test(a) || /^\s*grpc-opts:\s*\{.*\}\s*(?:#.*)?$/.test(a))) {
                r = n;
                break;
            }
        }
        if (-1 === r) {
            let t = -1;
            for (let n = e.length - 1; n >= 0; n--) if (e[n].trim()) {
                t = n;
                break;
            }
            return t >= 0 && e.splice(t + 1, 0, `${n}grpc-opts:`, `${n}  grpc-user-agent: ${u}`), 
            e;
        }
        const a = e[r];
        if (/^\s*grpc-opts:\s*\{.*\}\s*(?:#.*)?$/.test(a)) return /grpc-user-agent\s*:/i.test(a) || (e[r] = f(a)), 
        e;
        let s = e.length, o = t + 2, i = !1;
        for (let n = r + 1; n < e.length; n++) {
            const r = e[n], a = r.trim();
            if (!a) continue;
            const c = r.search(/\S/);
            if (c <= t) {
                s = n;
                break;
            }
            if (c > t && o === t + 2 && (o = c), /^grpc-user-agent\s*:/.test(a)) {
                i = !0;
                break;
            }
        }
        return i || e.splice(s, 0, `${" ".repeat(o)}grpc-user-agent: ${u}`), e;
    }, w = (e, t) => {
        let n = -1;
        for (let t = e.length - 1; t >= 0; t--) if (e[t].trim()) {
            n = t;
            break;
        }
        if (n < 0) return e;
        const r = " ".repeat(t), a = [ `${r}ech-opts:`, `${r}  enable: true` ];
        return s && a.push(`${r}  query-server-name: ${s}`), e.splice(n + 1, 0, ...a), e;
    };
    if (/^dns:\s*(?:\n|$)/m.test(h) || (h = "dns:\n  enable: true\n  default-nameserver:\n    - 223.5.5.5\n    - 119.29.29.29\n    - 114.114.114.114\n  use-hosts: true\n  nameserver:\n    - https://sm2.doh.pub/dns-query\n    - https://dns.alidns.com/dns-query\n  fallback:\n    - 8.8.4.4\n    - 208.67.220.220\n  fallback-filter:\n    geoip: true\n    geoip-code: CN\n    ipcidr:\n      - 240.0.0.0/4\n      - 127.0.0.1/32\n      - 0.0.0.0/32\n    domain:\n      - '+.google.com'\n      - '+.facebook.com'\n      - '+.youtube.com'\n" + h), 
    s && !a.includes(s) && a.push(s), r && a.length > 0) {
        h = ((e, t) => {
            if (/^\s{2}nameserver-policy:\s*(?:\n|$)/m.test(e)) return e.replace(/^(\s{2}nameserver-policy:\s*\n)/m, `$1${t}\n`);
            const n = e.split("\n");
            let r = -1, a = !1;
            for (let e = 0; e < n.length; e++) {
                const t = n[e];
                if (/^dns:\s*$/.test(t)) a = !0; else if (a && /^[a-zA-Z]/.test(t)) {
                    r = e;
                    break;
                }
            }
            const s = `  nameserver-policy:\n${t}`;
            return -1 !== r ? n.splice(r, 0, s) : n.push(s), n.join("\n");
        })(h, a.map(e => `    "${e}": ${o || ""}`).join("\n"));
    }
    if (!i && !l) return h;
    const S = h.split("\n"), m = [];
    let T = 0;
    for (;T < S.length; ) {
        const e = S[T], t = e.trim();
        if (t.startsWith("- {")) {
            let t = e, r = (e.match(/\{/g) || []).length - (e.match(/\}/g) || []).length;
            for (;r > 0 && T + 1 < S.length; ) T++, t += "\n" + S[T], r += (S[T].match(/\{/g) || []).length - (S[T].match(/\}/g) || []).length;
            l && (t = y(t)), i && g(t, !0) === n.trim() && (t = t.replace(/\}(\s*)$/, `, ech-opts: {enable: true${s ? `, query-server-name: ${s}` : ""}}}$1`)), 
            m.push(t), T++;
        } else if (t.startsWith("- name:")) {
            let t = [ e ], r = e.search(/\S/), a = r + 2;
            for (T++; T < S.length; ) {
                const e = S[T], n = e.trim();
                if (!n) {
                    t.push(e), T++;
                    break;
                }
                const a = e.search(/\S/);
                if (a <= r && n.startsWith("- ")) break;
                if (a < r && n) break;
                t.push(e), T++;
            }
            let s = t.join("\n");
            l && d(s) && (t = p(t, a), s = t.join("\n")), i && g(s, !1) === n.trim() && (t = w(t, a)), 
            m.push(...t);
        } else m.push(e), T++;
    }
    return m.join("\n");
}

async function Singbox订阅配置文件热补丁(e, t = {}) {
    const n = t?.UUID || null, r = t?.Fingerprint || "chrome", a = Boolean(t?.ECH), s = t?.ECHConfig?.SNI || "cloudflare-ech.com", o = e.replace("1.1.1.1", "8.8.8.8").replace("1.0.0.1", "8.8.4.4");
    try {
        const e = JSON.parse(o), t = e => null == e ? [] : Array.isArray(e) ? e : [ e ], i = () => e.route = e.route && "object" == typeof e.route ? e.route : {}, c = e => e && "object" == typeof e && !Array.isArray(e) && "string" == typeof e.server ? e.server : null, l = (n, r) => {
            if (!r || "string" != typeof r) return null;
            const a = i(), s = `${n}-${r}`, o = Array.isArray(a.rule_set) ? a.rule_set : t(a.rule_set);
            if (!o.some(e => e?.tag === s)) {
                const t = "geoip" === n ? a.geoip : a.geosite;
                o.push({
                    tag: s,
                    type: "remote",
                    format: "binary",
                    url: `https://raw.githubusercontent.com/SagerNet/sing-${n}/rule-set/${s}.srs`,
                    ...t?.download_detour ? {
                        download_detour: t.download_detour
                    } : {}
                }), e.experimental = e.experimental && "object" == typeof e.experimental ? e.experimental : {}, 
                e.experimental.cache_file = e.experimental.cache_file && "object" == typeof e.experimental.cache_file ? e.experimental.cache_file : {}, 
                e.experimental.cache_file.enabled ??= !0;
            }
            return a.rule_set = o, s;
        }, u = e => {
            if (!e || "object" != typeof e || Array.isArray(e)) return e;
            if ("logical" === e.type && Array.isArray(e.rules)) return e.rules = e.rules.map(u), 
            e;
            const n = [];
            for (const r of t(e.geoip)) "string" == typeof r && ("private" === r.toLowerCase() ? e.ip_is_private = !0 : n.push(l("geoip", r)));
            for (const r of t(e.source_geoip)) "string" == typeof r && (n.push(l("geoip", r)), 
            e.rule_set_ip_cidr_match_source = !0);
            for (const r of t(e.geosite)) "string" == typeof r && n.push(l("geosite", r));
            return n.length && (e.rule_set = [ ...new Set([ ...t(e.rule_set), ...n ].filter(Boolean)) ]), 
            delete e.geoip, delete e.source_geoip, delete e.geosite, e;
        }, h = (e, t) => {
            if (!(e = u(e)) || "object" != typeof e || Array.isArray(e)) return e;
            if ("logical" === e.type && Array.isArray(e.rules)) return e.rules = e.rules.map(e => h(e, t)), 
            e;
            const n = c(e);
            if (n && t.has(n)) {
                for (const t of [ "server", "strategy", "disable_cache", "rewrite_ttl", "client_subnet", "timeout" ]) delete e[t];
                e.action = "predefined", e.rcode = t.get(n);
            } else n && !e.action && (e.action = "route");
            return e;
        };
        if (Array.isArray(e.inbounds)) for (const n of e.inbounds) if (n && "object" == typeof n && "tun" === n.type) {
            for (const e of [ {
                targetKey: "address",
                sourceKeys: [ "inet4_address", "inet6_address" ]
            }, {
                targetKey: "route_address",
                sourceKeys: [ "inet4_route_address", "inet6_route_address" ]
            }, {
                targetKey: "route_exclude_address",
                sourceKeys: [ "inet4_route_exclude_address", "inet6_route_exclude_address" ]
            } ]) {
                const r = t(n[e.targetKey]);
                for (const a of e.sourceKeys) r.push(...t(n[a]));
                r.length && (n[e.targetKey] = [ ...new Set(r) ]);
                for (const t of e.sourceKeys) delete n[t];
            }
            if (n.tag) {
                const e = [];
                if (n.domain_strategy && e.push({
                    inbound: n.tag,
                    action: "resolve",
                    strategy: n.domain_strategy
                }), n.sniff) {
                    const t = {
                        inbound: n.tag,
                        action: "sniff"
                    };
                    n.sniff_timeout && (t.timeout = n.sniff_timeout), e.push(t);
                }
                if (e.length) {
                    const n = i();
                    n.rules = [ ...e, ...t(n.rules) ];
                }
            }
            delete n.sniff, delete n.sniff_timeout, delete n.domain_strategy;
        }
        if (e?.route && "object" == typeof e.route && Array.isArray(e.route.rules)) {
            const t = e => (e = u(e), "logical" === e?.type && Array.isArray(e.rules) ? e.rules = e.rules.map(t) : e && "object" == typeof e && !Array.isArray(e) && e.outbound && !e.action && (e.action = "route"), 
            e);
            e.route.rules = e.route.rules.map(t);
        }
        const f = e?.dns;
        if (f && "object" == typeof f) {
            const e = f.fakeip && "object" == typeof f.fakeip ? f.fakeip : null, n = new Map, r = {
                "tcp:": "tcp",
                "udp:": "udp",
                "tls:": "tls",
                "quic:": "quic",
                "https:": "https",
                "h3:": "h3"
            }, a = {
                success: "NOERROR",
                format_error: "FORMERR",
                server_failure: "SERVFAIL",
                name_error: "NXDOMAIN",
                not_implemented: "NOTIMP",
                refused: "REFUSED"
            };
            let s = !1;
            if (Array.isArray(f.servers)) {
                const t = [];
                for (const o of f.servers) {
                    if (!o || "object" != typeof o || Array.isArray(o)) {
                        t.push(o);
                        continue;
                    }
                    const i = {
                        ...o
                    };
                    let c = null, l = "", u = "string" == typeof i.address ? i.address.trim() : "";
                    if (u) {
                        const e = u.toLowerCase();
                        if ("fakeip" === e) c = {
                            type: "fakeip"
                        }; else if ("local" === e) c = {
                            type: "local"
                        }; else if (e.startsWith("rcode://")) c = {
                            type: "rcode"
                        }, l = u.slice(8).toLowerCase(); else if (e.startsWith("dhcp://")) {
                            const e = u.slice(7);
                            c = e && "auto" !== e.toLowerCase() ? {
                                type: "dhcp",
                                interface: e
                            } : {
                                type: "dhcp"
                            };
                        } else {
                            try {
                                const e = new URL(u), t = r[e.protocol.toLowerCase()];
                                if (t) {
                                    c = {
                                        type: t,
                                        server: (e.hostname?.startsWith("[") && e.hostname.endsWith("]") ? e.hostname.slice(1, -1) : e.hostname) || e.host || u,
                                        ...e.port ? {
                                            server_port: Number(e.port)
                                        } : {},
                                        ..."https" !== t && "h3" !== t || !e.pathname || "/dns-query" === e.pathname ? {} : {
                                            path: e.pathname
                                        }
                                    };
                                }
                            } catch (e) {}
                            c || (c = {
                                type: "udp",
                                server: u
                            });
                        }
                    }
                    if ("rcode" === c?.type) {
                        const e = a[l] || "NOERROR";
                        "string" == typeof i.tag && i.tag && (n.set(i.tag, e), n.set(i.tag.startsWith("dns_") ? i.tag.slice(4) : `dns_${i.tag}`, e));
                        continue;
                    }
                    if (c && (delete i.address, Object.assign(i, c)), void 0 !== i.address_resolver && void 0 === i.domain_resolver && (i.domain_resolver = i.address_resolver), 
                    void 0 !== i.address_strategy && void 0 === i.domain_strategy && (i.domain_strategy = i.address_strategy), 
                    delete i.address_resolver, delete i.address_strategy, "DIRECT" === i.detour && delete i.detour, 
                    "fakeip" === i.type && (s = !0, e)) for (const t of [ "inet4_range", "inet6_range" ]) void 0 !== e[t] && void 0 === i[t] && (i[t] = e[t]);
                    t.push(i);
                }
                f.servers = t;
            }
            if (e && !s && !1 !== e.enabled) {
                const t = {
                    type: "fakeip",
                    tag: "fakeip"
                };
                for (const e of Array.isArray(f.rules) ? f.rules : []) {
                    const n = c(e);
                    if (n && n.toLowerCase().includes("fakeip")) {
                        t.tag = n;
                        break;
                    }
                }
                for (const n of [ "inet4_range", "inet6_range" ]) void 0 !== e[n] && (t[n] = e[n]);
                Array.isArray(f.servers) ? f.servers.push(t) : f.servers = [ t ];
            }
            if (Array.isArray(f.rules)) {
                const e = [];
                for (const r of f.rules) {
                    const a = c(r), s = t(r?.outbound), o = new Set([ "outbound", "server", "action", "strategy", "disable_cache", "rewrite_ttl", "client_subnet", "timeout" ]);
                    if (r && "object" == typeof r && !Array.isArray(r) && "logical" !== r.type && a && s.includes("any") && Object.keys(r).every(e => o.has(e))) {
                        const e = i();
                        if (void 0 === e.default_domain_resolver) {
                            const t = {
                                server: a
                            };
                            for (const e of [ "strategy", "disable_cache", "rewrite_ttl", "client_subnet", "timeout" ]) void 0 !== r[e] && (t[e] = r[e]);
                            e.default_domain_resolver = 1 === Object.keys(t).length ? t.server : t;
                        }
                        continue;
                    }
                    e.push(h(r, n));
                }
                f.rules = e;
            }
            delete f.fakeip, delete f.independent_cache;
        }
        if (e?.route && "object" == typeof e.route && (delete e.route.geoip, delete e.route.geosite), 
        "DIRECT" === e?.ntp?.detour && delete e.ntp.detour, Array.isArray(e.outbounds)) {
            const t = new Set(e.outbounds.map(e => e?.tag).filter(Boolean)), n = e => "REJECT" === e || e && "object" == typeof e && (Array.isArray(e) ? e.some(n) : Object.values(e).some(n));
            !t.has("REJECT") && n({
                outbounds: e.outbounds,
                route: e.route
            }) && e.outbounds.push({
                type: "block",
                tag: "REJECT"
            });
        }
        return n && e.outbounds?.forEach(e => {
            (e.uuid && e.uuid === n || e.password && e.password === n) && (e.tls || (e.tls = {
                enabled: !0
            }), r && (e.tls.utls = {
                enabled: !0,
                fingerprint: r
            }), a && (e.tls.ech = {
                enabled: !0,
                query_server_name: s
            }));
        }), JSON.stringify(e, null, 2);
    } catch (e) {
        return console.error("Singbox热补丁执行失败:", e), JSON.stringify(JSON.parse(o), null, 2);
    }
}

function Surge订阅配置文件热补丁(e, t, n) {
    const r = e.includes("\r\n") ? e.split("\r\n") : e.split("\n"), a = n.随机路径 ? 随机路径(n.完整节点路径) : n.完整节点路径;
    let s = "";
    for (let e of r) if (!e.includes("= trojan,") || e.includes("ws=true") || e.includes("ws-path=")) s += e + "\n"; else {
        const t = e.split("sni=")[1].split(",")[0], r = `sni=${t}, skip-cert-verify=${n.跳过证书验证}`, o = `sni=${t}, skip-cert-verify=${n.跳过证书验证}, ws=true, ws-path=${a.replace(/,/g, "%2C")}, ws-headers=Host:"${t}"`;
        s += e.replace(new RegExp(r, "g"), o).replace("[", "").replace("]", "") + "\n";
    }
    return s = `#!MANAGED-CONFIG ${t} interval=${60 * n.优选订阅生成.SUBUpdateTime * 60} strict=false` + s.substring(s.indexOf("\n")), 
    s;
}

async function 请求日志记录(e, t, n, r = "Get_SUB", a, s = !0) {
    try {
        const o = new Date, i = {
            TYPE: r,
            IP: n,
            ASN: `AS${t.cf.asn || "0"} ${t.cf.asOrganization || "Unknown"}`,
            CC: `${t.cf.country || "N/A"} ${t.cf.city || "N/A"}`,
            URL: t.url,
            UA: t.headers.get("User-Agent") || "Unknown",
            TIME: o.getTime()
        };
        if (a.TG.启用) try {
            const t = await e.KV.get("tg.json"), n = JSON.parse(t);
            if (n?.BotToken && n?.ChatID) {
                const e = new Date(i.TIME).toLocaleString("zh-CN", {
                    timeZone: "Asia/Shanghai"
                }), t = new URL(i.URL), r = `<b>#${a.优选订阅生成.SUBNAME} 日志通知</b>\n\n📌 <b>类型：</b>#${i.TYPE}\n🌐 <b>IP：</b><code>${i.IP}</code>\n📍 <b>位置：</b>${i.CC}\n🏢 <b>ASN：</b>${i.ASN}\n🔗 <b>域名：</b><code>${t.host}</code>\n🔍 <b>路径：</b><code>${t.pathname + t.search}</code>\n🤖 <b>UA：</b><code>${i.UA}</code>\n📅 <b>时间：</b>${e}\n` + (a.CF.Usage.success ? `📊 <b>请求用量：</b>${a.CF.Usage.total}/${a.CF.Usage.max} <b>${(a.CF.Usage.total / a.CF.Usage.max * 100).toFixed(2)}%</b>\n` : "");
                await fetch(`https://api.telegram.org/bot${n.BotToken}/sendMessage?chat_id=${n.ChatID}&parse_mode=HTML&text=${encodeURIComponent(r)}`, {
                    method: "GET",
                    headers: {
                        Accept: "text/html,application/xhtml+xml,application/xml;",
                        "Accept-Encoding": "gzip, deflate, br",
                        "User-Agent": i.UA || "Unknown"
                    }
                });
            }
        } catch (e) {
            console.error(`读取tg.json出错: ${e.message}`);
        }
        if (!(s = ![ "1", "true" ].includes(e.OFF_LOG) && s)) return;
        let c = [];
        const l = await e.KV.get("log.json"), u = 4;
        if (l) try {
            if (c = JSON.parse(l), Array.isArray(c)) if ("Get_SUB" !== r) {
                const e = o.getTime() - 18e5;
                if (c.some(r => "Get_SUB" !== r.TYPE && r.IP === n && r.URL === t.url && r.UA === (t.headers.get("User-Agent") || "Unknown") && r.TIME >= e)) return;
                for (c.push(i); JSON.stringify(c, null, 2).length > 1024 * u * 1024 && c.length > 0; ) c.shift();
            } else for (c.push(i); JSON.stringify(c, null, 2).length > 1024 * u * 1024 && c.length > 0; ) c.shift(); else c = [ i ];
        } catch (e) {
            c = [ i ];
        } else c = [ i ];
        await e.KV.put("log.json", JSON.stringify(c, null, 2));
    } catch (e) {
        console.error(`日志记录失败: ${e.message}`);
    }
}

function 掩码敏感信息(e, t = 3, n = 2) {
    if (!e || "string" != typeof e) return e;
    if (e.length <= t + n) return e;
    const r = e.slice(0, t), a = e.slice(-n), s = e.length - t - n;
    return `${r}${"*".repeat(s)}${a}`;
}

async function MD5MD5(e) {
    const t = new TextEncoder, n = await crypto.subtle.digest("MD5", t.encode(e)), r = Array.from(new Uint8Array(n)).map(e => e.toString(16).padStart(2, "0")).join(""), a = await crypto.subtle.digest("MD5", t.encode(r.slice(7, 27)));
    return Array.from(new Uint8Array(a)).map(e => e.toString(16).padStart(2, "0")).join("").toLowerCase();
}

function 随机路径(e = "/") {
    const t = Math.floor(3 * Math.random() + 1), n = [ "about", "account", "acg", "act", "activity", "ad", "ads", "ajax", "album", "albums", "anime", "api", "app", "apps", "archive", "archives", "article", "articles", "ask", "auth", "avatar", "bbs", "bd", "blog", "blogs", "book", "books", "bt", "buy", "cart", "category", "categories", "cb", "channel", "channels", "chat", "china", "city", "class", "classify", "clip", "clips", "club", "cn", "code", "collect", "collection", "comic", "comics", "community", "company", "config", "contact", "content", "course", "courses", "cp", "data", "detail", "details", "dh", "directory", "discount", "discuss", "dl", "dload", "doc", "docs", "document", "documents", "doujin", "download", "downloads", "drama", "edu", "en", "ep", "episode", "episodes", "event", "events", "f", "faq", "favorite", "favourites", "favs", "feedback", "file", "files", "film", "films", "forum", "forums", "friend", "friends", "game", "games", "gif", "go", "go.html", "go.php", "group", "groups", "help", "home", "hot", "htm", "html", "image", "images", "img", "index", "info", "intro", "item", "items", "ja", "jp", "jump", "jump.html", "jump.php", "jumping", "knowledge", "lang", "lesson", "lessons", "lib", "library", "link", "links", "list", "live", "lives", "m", "mag", "magnet", "mall", "manhua", "map", "member", "members", "message", "messages", "mobile", "movie", "movies", "music", "my", "new", "news", "note", "novel", "novels", "online", "order", "out", "out.html", "out.php", "outbound", "p", "page", "pages", "pay", "payment", "pdf", "photo", "photos", "pic", "pics", "picture", "pictures", "play", "player", "playlist", "post", "posts", "product", "products", "program", "programs", "project", "qa", "question", "rank", "ranking", "read", "readme", "redirect", "redirect.html", "redirect.php", "reg", "register", "res", "resource", "retrieve", "sale", "search", "season", "seasons", "section", "seller", "series", "service", "services", "setting", "settings", "share", "shop", "show", "shows", "site", "soft", "sort", "source", "special", "star", "stars", "static", "stock", "store", "stream", "streaming", "streams", "student", "study", "tag", "tags", "task", "teacher", "team", "tech", "temp", "test", "thread", "tool", "tools", "topic", "topics", "torrent", "trade", "travel", "tv", "txt", "type", "u", "upload", "uploads", "url", "urls", "user", "users", "v", "version", "videos", "view", "vip", "vod", "watch", "web", "wenku", "wiki", "work", "www", "zh", "zh-cn", "zh-tw", "zip" ].sort(() => .5 - Math.random()).slice(0, t).join("/");
    return "/" === e ? `/${n}` : `/${n + e.replace("/?", "?")}`;
}

function 替换星号为随机字符(e) {
    if ("string" != typeof e || !e.includes("*")) return e;
    const t = "abcdefghijklmnopqrstuvwxyz0123456789";
    return e.replace(/\*/g, () => {
        let e = "";
        for (let n = 0; n < Math.floor(14 * Math.random()) + 3; n++) e += t[Math.floor(36 * Math.random())];
        return e;
    });
}

const DoH缓存 = {}, DoH缓存最大条目 = 256, DoH记录类型映射 = {
    A: 1,
    NS: 2,
    CNAME: 5,
    MX: 15,
    TXT: 16,
    AAAA: 28,
    SRV: 33,
    HTTPS: 65
};

async function DoH查询(e, t, n = "https://cloudflare-dns.com/dns-query") {
    const r = String(e || "").trim().toLowerCase().replace(/\.$/, ""), a = String(t || "").trim().toUpperCase(), s = `${r}:${a}`, o = DoH记录类型映射[a] || 1, i = Date.now(), c = DoH缓存[s];
    if (c && i < c.过期时间) return log(`[DoH查询] 命中缓存 ${e} ${t} via ${n}`), c.data.map(e => ({
        type: o,
        data: e
    }));
    const l = performance.now();
    log(`[DoH查询] 开始查询 ${e} ${t} via ${n}`);
    try {
        const a = (e => {
            const t = e.endsWith(".") ? e.slice(0, -1).split(".") : e.split("."), n = [];
            for (const e of t) {
                const t = (new TextEncoder).encode(e);
                n.push(new Uint8Array([ t.length ]), t);
            }
            n.push(new Uint8Array([ 0 ]));
            const r = n.reduce((e, t) => e + t.length, 0), a = new Uint8Array(r);
            let s = 0;
            for (const e of n) a.set(e, s), s += e.length;
            return a;
        })(r), i = new Uint8Array(12 + a.length + 4), c = new DataView(i.buffer);
        c.setUint16(0, crypto.getRandomValues(new Uint16Array(1))[0]), c.setUint16(2, 256), 
        c.setUint16(4, 1), i.set(a, 12), c.setUint16(12 + a.length, o), c.setUint16(12 + a.length + 2, 1), 
        log(`[DoH查询] 发送查询报文 ${e} via ${n} (type=${o}, ${i.length}字节)`);
        const u = await fetch(n, {
            method: "POST",
            headers: {
                "Content-Type": "application/dns-message",
                Accept: "application/dns-message"
            },
            body: i
        });
        if (!u.ok) return console.warn(`[DoH查询] 请求失败 ${e} ${t} via ${n} 响应代码:${u.status}`), 
        [];
        const h = new Uint8Array(await u.arrayBuffer()), f = new DataView(h.buffer), d = f.getUint16(4), g = f.getUint16(6);
        log(`[DoH查询] 收到响应 ${e} ${t} via ${n} (${h.length}字节, ${g}条应答)`);
        const y = e => {
            const t = [];
            let n = e, r = !1, a = -1, s = 128;
            for (;n < h.length && s-- > 0; ) {
                const e = h[n];
                if (0 === e) {
                    r || (a = n + 1);
                    break;
                }
                192 & ~e ? (t.push((new TextDecoder).decode(h.slice(n + 1, n + 1 + e))), n += e + 1) : (r || (a = n + 2), 
                n = (63 & e) << 8 | h[n + 1], r = !0);
            }
            return -1 === a && (a = n + 1), [ t.join("."), a ];
        };
        let p = 12;
        for (let e = 0; e < d; e++) {
            const [, e] = y(p);
            p = e + 4;
        }
        const w = [];
        for (let e = 0; e < g && p < h.length; e++) {
            const [e, t] = y(p);
            p = t;
            const n = f.getUint16(p);
            p += 2, p += 2;
            const r = f.getUint32(p);
            p += 4;
            const a = f.getUint16(p);
            p += 2;
            const s = h.slice(p, p + a);
            let o;
            if (p += a, 1 === n && 4 === a) o = `${s[0]}.${s[1]}.${s[2]}.${s[3]}`; else if (28 === n && 16 === a) {
                const e = [];
                for (let t = 0; t < 16; t += 2) e.push((s[t] << 8 | s[t + 1]).toString(16));
                o = e.join(":");
            } else if (16 === n) {
                let e = 0;
                const t = [];
                for (;e < a; ) {
                    const n = s[e++];
                    t.push((new TextDecoder).decode(s.slice(e, e + n))), e += n;
                }
                o = t.join("");
            } else if (5 === n) {
                const [e] = y(p - a);
                o = e;
            } else o = Array.from(s).map(e => e.toString(16).padStart(2, "0")).join("");
            w.push({
                name: e,
                type: n,
                TTL: r,
                data: o,
                rdata: s
            });
        }
        log(`[DoH查询] 查询完成 ${e} ${t} via ${n} ${(performance.now() - l).toFixed(2)}ms 共${w.length}条结果${w.length > 0 ? "\n" + w.map((e, t) => `  ${t + 1}. ${e.name} type=${e.type} TTL=${e.TTL} data=${e.data}`).join("\n") : ""}`);
        const S = w.filter(e => e.type === o), m = S.length > 0 ? Math.min(...S.map(e => e.TTL)) : 0, T = Math.max(m, 300), b = Date.now() + 1e3 * T, C = S.map(e => e.data);
        if (C.length > 0 || 0 === w.length) {
            if (Object.keys(DoH缓存).length >= DoH缓存最大条目) {
                const e = Date.now();
                for (const [t, n] of Object.entries(DoH缓存)) e >= n.过期时间 && delete DoH缓存[t];
                Object.keys(DoH缓存).length >= DoH缓存最大条目 && delete DoH缓存[Object.keys(DoH缓存)[0]];
            }
            DoH缓存[s] = {
                data: C,
                "过期时间": b
            }, log(`[DoH查询] 写入缓存 ${e} ${t} TTL=${T}s${0 === C.length ? "（空结果）" : ""}`);
        }
        return w;
    } catch (r) {
        const a = (performance.now() - l).toFixed(2);
        return console.error(`[DoH查询] 查询失败 ${e} ${t} via ${n} ${a}ms:`, r), [];
    }
}

async function 读取config_JSON(e, t, n, r = "Mozilla/5.0", a = !1) {
    const s = 特征码字典[0], o = t, i = "https://dns.alidns.com/dns-query", c = "cloudflare-ech.com", l = "{{IP:PORT}}", u = performance.now(), h = {
        TIME: (new Date).toISOString(),
        HOST: o,
        HOSTS: [ t ],
        UUID: n,
        PATH: "/",
        "协议类型": "vless",
        "传输协议": "ws",
        "gRPC模式": "gun",
        gRPCUserAgent: r,
        "跳过证书验证": !1,
        "启用0RTT": !1,
        "TLS分片": null,
        "随机路径": !1,
        ECH: !1,
        ECHConfig: {
            DNS: i,
            SNI: c
        },
        SS: {
            "加密方式": "aes-128-gcm",
            TLS: !0
        },
        Fingerprint: "chrome",
        "优选订阅生成": {
            local: !0,
            "本地IP库": {
                "随机IP": !0,
                "随机数量": 16,
                "指定端口": -1
            },
            SUB: null,
            SUBNAME: "edgetunnel",
            SUBUpdateTime: 3,
            TOKEN: await MD5MD5(t + n)
        },
        "订阅转换配置": {
            SUBAPI: `https://SUBAPI.${特征码字典[1]}ssss.net`,
            SUBCONFIG: `https://raw.githubusercontent.com/${特征码字典[1]}/ACL4SSR/refs/heads/main/Clash/config/ACL4SSR_Online_Mini_MultiMode_CF.ini`,
            SUBEMOJI: !1,
            SUBLIST: !1,
            UDP: !1,
            XUDP: !1,
            TLS13: !1,
            APPEND_TYPE: !1,
            SORT: !1
        },
        "反代": {
            [s]: "auto",
            SOCKS5: {
                "启用": null,
                "全局": !1,
                "账号": "",
                "白名单": SOCKS5白名单
            },
            "路径模板": {
                [s]: "proxyip=" + l,
                SOCKS5: {
                    "全局": "socks5://" + l,
                    "标准": "socks5=" + l
                },
                HTTP: {
                    "全局": "http://" + l,
                    "标准": "http=" + l
                },
                HTTPS: {
                    "全局": "https://" + l,
                    "标准": "https=" + l
                },
                TURN: {
                    "全局": "turn://" + l,
                    "标准": "turn=" + l
                },
                SSTP: {
                    "全局": "sstp://" + l,
                    "标准": "sstp=" + l
                }
            }
        },
        TG: {
            "启用": !1,
            BotToken: null,
            ChatID: null
        },
        CF: {
            Email: null,
            GlobalAPIKey: null,
            AccountID: null,
            APIToken: null,
            UsageAPI: null,
            Usage: {
                success: !1,
                pages: 0,
                workers: 0,
                total: 0,
                max: 1e5
            }
        }
    };
    try {
        let t = await e.KV.get("config.json");
        t && 1 != a ? config_JSON = JSON.parse(t) : (await e.KV.put("config.json", JSON.stringify(h, null, 2)), 
        config_JSON = h);
    } catch (e) {
        console.error(`读取config_JSON出错: ${e.message}`), config_JSON = h;
    }
    config_JSON.订阅转换配置.SUBLIST || (config_JSON.订阅转换配置.SUBLIST = !1), config_JSON.订阅转换配置.UDP || (config_JSON.订阅转换配置.UDP = !1), 
    config_JSON.订阅转换配置.XUDP || (config_JSON.订阅转换配置.XUDP = !1), config_JSON.订阅转换配置.TLS13 || (config_JSON.订阅转换配置.TLS13 = !1), 
    config_JSON.订阅转换配置.APPEND_TYPE || (config_JSON.订阅转换配置.APPEND_TYPE = !1), config_JSON.订阅转换配置.SORT || (config_JSON.订阅转换配置.SORT = !1), 
    config_JSON.gRPCUserAgent || (config_JSON.gRPCUserAgent = r), config_JSON.HOST = o, 
    config_JSON.HOSTS || (config_JSON.HOSTS = [ t ]), e.HOST && (config_JSON.HOSTS = (await 整理成数组(e.HOST)).map(e => e.toLowerCase().replace(/^https?:\/\//, "").split("/")[0].split(":")[0])), 
    config_JSON.UUID = n, config_JSON.随机路径 || (config_JSON.随机路径 = !1), config_JSON.启用0RTT || (config_JSON.启用0RTT = !1), 
    e.PATH ? config_JSON.PATH = e.PATH.startsWith("/") ? e.PATH : "/" + e.PATH : config_JSON.PATH || (config_JSON.PATH = "/"), 
    config_JSON.gRPC模式 || (config_JSON.gRPC模式 = "gun"), config_JSON.SS || (config_JSON.SS = {
        "加密方式": "aes-128-gcm",
        TLS: !1
    }), config_JSON.反代.路径模板?.[s] || (config_JSON.反代.路径模板 = {
        [s]: "proxyip=" + l,
        SOCKS5: {
            "全局": "socks5://" + l,
            "标准": "socks5=" + l
        },
        HTTP: {
            "全局": "http://" + l,
            "标准": "http=" + l
        },
        HTTPS: {
            "全局": "https://" + l,
            "标准": "https=" + l
        },
        TURN: {
            "全局": "turn://" + l,
            "标准": "turn=" + l
        },
        SSTP: {
            "全局": "sstp://" + l,
            "标准": "sstp=" + l
        }
    }), config_JSON.反代.路径模板.HTTPS || (config_JSON.反代.路径模板.HTTPS = {
        "全局": "https://" + l,
        "标准": "https=" + l
    }), config_JSON.反代.路径模板.TURN || (config_JSON.反代.路径模板.TURN = {
        "全局": "turn://" + l,
        "标准": "turn=" + l
    }), config_JSON.反代.路径模板.SSTP || (config_JSON.反代.路径模板.SSTP = {
        "全局": "sstp://" + l,
        "标准": "sstp=" + l
    });
    const f = config_JSON.反代.路径模板[config_JSON.反代.SOCKS5.启用?.toUpperCase()];
    let d = "";
    f && config_JSON.反代.SOCKS5.账号 ? d = (config_JSON.反代.SOCKS5.全局 ? f.全局 : f.标准).replace(l, config_JSON.反代.SOCKS5.账号) : "auto" !== config_JSON.反代[s] && (d = config_JSON.反代.路径模板[s].replace(l, config_JSON.反代[s]));
    let g = "";
    if (d.includes("?")) {
        const [e, t] = d.split("?");
        d = e, g = t;
    }
    config_JSON.PATH = config_JSON.PATH.replace(d, "").replace("//", "/");
    const y = "/" === config_JSON.PATH ? "" : config_JSON.PATH.replace(/\/+(?=\?|$)/, "").replace(/\/+$/, ""), [p, ...w] = y.split("?"), S = w.length ? "?" + w.join("?") : "", m = g ? S ? S + "&" + g : "?" + g : S;
    config_JSON.完整节点路径 = (p || "/") + (p && d ? "/" : "") + d + m + (config_JSON.启用0RTT ? (m ? "&" : "?") + "ed=2560" : ""), 
    config_JSON.TLS分片 || null === config_JSON.TLS分片 || (config_JSON.TLS分片 = null);
    const T = "Shadowrocket" == config_JSON.TLS分片 ? `&fragment=${encodeURIComponent("1,40-60,30-50,tlshello")}` : "Happ" == config_JSON.TLS分片 ? `&fragment=${encodeURIComponent("3,1,tlshello")}` : "";
    config_JSON.Fingerprint || (config_JSON.Fingerprint = "chrome"), config_JSON.ECH || (config_JSON.ECH = !1), 
    config_JSON.ECHConfig || (config_JSON.ECHConfig = {
        DNS: i,
        SNI: c
    });
    const b = config_JSON.ECH ? `&ech=${encodeURIComponent((config_JSON.ECHConfig.SNI ? config_JSON.ECHConfig.SNI + "+" : "") + config_JSON.ECHConfig.DNS)}` : "", {type: C, "路径字段名": A, "域名字段名": E} = 获取传输协议配置(config_JSON), U = 获取传输路径参数值(config_JSON, config_JSON.完整节点路径);
    config_JSON.LINK = "ss" === config_JSON.协议类型 ? `${config_JSON.协议类型}://${btoa(config_JSON.SS.加密方式 + ":" + n)}@${o}:${config_JSON.SS.TLS ? "443" : "80"}?plugin=v2${encodeURIComponent(`ray-plugin;mode=websocket;host=${o};path=${(config_JSON.完整节点路径.includes("?") ? config_JSON.完整节点路径.replace("?", "?enc=" + config_JSON.SS.加密方式 + "&") : config_JSON.完整节点路径 + "?enc=" + config_JSON.SS.加密方式) + (config_JSON.SS.TLS ? ";tls" : "")};mux=0`) + b}#${encodeURIComponent(config_JSON.优选订阅生成.SUBNAME)}` : `${config_JSON.协议类型}://${n}@${o}:443?security=tls&type=${C + b}&${E}=${o}&fp=${config_JSON.Fingerprint}&sni=${o}&${A}=${encodeURIComponent(U) + T}&encryption=none#${encodeURIComponent(config_JSON.优选订阅生成.SUBNAME)}`, 
    config_JSON.优选订阅生成.TOKEN = await MD5MD5(t + n);
    const P = {
        BotToken: null,
        ChatID: null
    };
    config_JSON.TG = {
        "启用": !!config_JSON.TG.启用 && config_JSON.TG.启用,
        ...P
    };
    try {
        const t = await e.KV.get("tg.json");
        if (t) {
            const e = JSON.parse(t);
            config_JSON.TG.ChatID = e.ChatID ? e.ChatID : null, config_JSON.TG.BotToken = e.BotToken ? 掩码敏感信息(e.BotToken) : null;
        } else await e.KV.put("tg.json", JSON.stringify(P, null, 2));
    } catch (e) {
        console.error(`读取tg.json出错: ${e.message}`);
    }
    const N = {
        Email: null,
        GlobalAPIKey: null,
        AccountID: null,
        APIToken: null,
        UsageAPI: null
    };
    config_JSON.CF = {
        ...N,
        Usage: {
            success: !1,
            pages: 0,
            workers: 0,
            total: 0,
            max: 1e5
        }
    };
    try {
        const t = await e.KV.get("cf.json");
        if (t) {
            const e = JSON.parse(t);
            if (e.UsageAPI) try {
                const t = await fetch(e.UsageAPI), n = await t.json();
                config_JSON.CF.Usage = n;
            } catch (e) {
                console.error(`请求 CF_JSON.UsageAPI 失败: ${e.message}`);
            } else {
                config_JSON.CF.Email = e.Email ? e.Email : null, config_JSON.CF.GlobalAPIKey = e.GlobalAPIKey ? 掩码敏感信息(e.GlobalAPIKey) : null, 
                config_JSON.CF.AccountID = e.AccountID ? 掩码敏感信息(e.AccountID) : null, config_JSON.CF.APIToken = e.APIToken ? 掩码敏感信息(e.APIToken) : null, 
                config_JSON.CF.UsageAPI = null;
                const t = await getCloudflareUsage(e.Email, e.GlobalAPIKey, e.AccountID, e.APIToken);
                config_JSON.CF.Usage = t;
            }
        } else await e.KV.put("cf.json", JSON.stringify(N, null, 2));
    } catch (e) {
        console.error(`读取cf.json出错: ${e.message}`);
    }
    return config_JSON.加载时间 = (performance.now() - u).toFixed(2) + "ms", config_JSON;
}

function 识别运营商(e) {
    const t = e?.cf;
    if ("cn" !== String(t?.country || "").toLowerCase()) return "cf";
    const n = String(t?.asOrganization || "").toLowerCase(), r = [ {
        code: "ct",
        pattern: /chinanet|chinatelecom|china telecom|cn2|shtel/
    }, {
        code: "cmcc",
        pattern: /cmi|cmnet|chinamobile|china mobile|cmcc|mobile communications/
    }, {
        code: "cu",
        pattern: /china169|china unicom|chinaunicom|cucc|cncgroup|cuii|netcom/
    } ].find(({pattern: e}) => e.test(n))?.code;
    return r || {
        4134: "ct",
        4809: "ct",
        4811: "ct",
        4812: "ct",
        4815: "ct",
        4837: "cu",
        4814: "cu",
        9929: "cu",
        17623: "cu",
        17816: "cu",
        9808: "cmcc",
        24400: "cmcc",
        56040: "cmcc",
        56041: "cmcc",
        56044: "cmcc"
    }[String(t?.asn || "")] || "cf";
}

async function 生成随机IP(e, t = 16, n = -1) {
    const r = new URL(e.url), a = String(r.searchParams.get("cnIspCode") || "").toLowerCase(), s = [ "ct", "cu", "cmcc", "cf" ].includes(a) ? a : 识别运营商(e), o = "cf" === s ? `https://raw.githubusercontent.com/${特征码字典[1]}/${特征码字典[1]}/main/CF-CIDR.txt` : `https://raw.githubusercontent.com/${特征码字典[1]}/${特征码字典[1]}/main/CF-CIDR/${s}.txt`, i = {
        cmcc: "CF移动优选",
        cu: "CF联通优选",
        ct: "CF电信优选",
        cf: "CF官方优选"
    }[s] || "CF官方优选", c = [ 443, 2053, 2083, 2087, 2096, 8443 ];
    let l = [];
    try {
        const e = await fetch(o);
        l = e.ok ? await 整理成数组(await e.text()) : [ "104.16.0.0/13" ];
    } catch {
        l = [ "104.16.0.0/13" ];
    }
    const u = Array.from({
        length: t
    }, (e, t) => `${(e => {
        const [t, n] = e.split("/"), r = 32 - parseInt(n), a = ((t.split(".").reduce((e, t, n) => e | parseInt(t) << 24 - 8 * n, 0) & 4294967295 << r >>> 0) >>> 0) + Math.floor(Math.random() * Math.pow(2, r)) >>> 0;
        return [ a >>> 24 & 255, a >>> 16 & 255, a >>> 8 & 255, 255 & a ].join(".");
    })(l[Math.floor(Math.random() * l.length)])}:${-1 === n ? c[Math.floor(Math.random() * c.length)] : n}#${i}${t + 1}`);
    return [ u, u.join("\n") ];
}

async function 整理成数组(e) {
    var t = e.replace(/[	"'\r\n]+/g, ",").replace(/,+/g, ",");
    "," == t.charAt(0) && (t = t.slice(1)), "," == t.charAt(t.length - 1) && (t = t.slice(0, t.length - 1));
    return t.split(",");
}

async function 获取优选订阅生成器数据(e) {
    let t = [], n = "", r = e.replace(/^sub:\/\//i, "https://").split("#")[0].split("?")[0];
    /^https?:\/\//i.test(r) || (r = `https://${r}`);
    try {
        r = new URL(r).origin;
    } catch (r) {
        return t.push(`127.0.0.1:1234#${e}优选订阅生成器格式化异常:${r.message}`), [ t, n ];
    }
    const a = `${r}/sub?host=example.com&uuid=00000000-0000-4000-8000-000000000000`;
    try {
        const r = await fetch(a, {
            headers: {
                "User-Agent": "v2rayN/edgetunnel (https://github.com/" + 特征码字典[1] + "/edgetunnel)"
            }
        });
        if (!r.ok) return t.push(`127.0.0.1:1234#${e}优选订阅生成器异常:${r.statusText}`), [ t, n ];
        const s = atob(await r.text()), o = s.includes("\r\n") ? s.split("\r\n") : s.split("\n");
        for (const e of o) if (e.trim()) if (e.includes("00000000-0000-4000-8000-000000000000") && e.includes("example.com")) {
            const n = e.match(/:\/\/[^@]+@([^?]+)/);
            if (n) {
                let r = n[1], a = "";
                const s = e.match(/#(.+)$/);
                s && (a = "#" + decodeURIComponent(s[1])), t.push(r + a);
            }
        } else n += e + "\n";
    } catch (n) {
        t.push(`127.0.0.1:1234#${e}优选订阅生成器异常:${n.message}`);
    }
    return [ t, n ];
}

async function 请求优选API(e, t = "443", n = 3e3) {
    if (!e?.length) return [ [], [], [], [] ];
    const r = new Set, a = new Set;
    let s = "";
    await Promise.allSettled(e.map(async e => {
        const o = e.indexOf("#"), i = o > -1 ? e.substring(0, o) : e, c = o > -1 ? decodeURIComponent(e.substring(o + 1)) : null, l = e.toLowerCase().includes("proxyip=true");
        if (i.toLowerCase().startsWith("sub://")) try {
            const [e, t] = await 获取优选订阅生成器数据(i);
            if (c) for (const t of e) {
                const e = t.includes("#") ? `${t} [${c}]` : `${t}#[${c}]`;
                r.add(e), l && a.add(t.split("#")[0]);
            } else for (const t of e) r.add(t), l && a.add(t.split("#")[0]);
            if (t && "string" == typeof t && c) {
                const e = t.replace(/([a-z][a-z0-9+\-.]*:\/\/[^\r\n]*?)(\r?\n|$)/gi, (e, t, n) => `${t.includes("#") ? `${t}${encodeURIComponent(` [${c}]`)}` : `${t}${encodeURIComponent(`#[${c}]`)}`}${n}`);
                s += e;
            } else t && "string" == typeof t && (s += t);
        } catch (e) {} else try {
            const e = new AbortController, o = setTimeout(() => e.abort(), n), u = await fetch(i, {
                signal: e.signal
            });
            clearTimeout(o);
            let h = "";
            try {
                const e = await u.arrayBuffer(), t = (u.headers.get("content-type") || "").toLowerCase(), n = t.match(/charset=([^\s;]+)/i)?.[1]?.toLowerCase() || "";
                let r = [ "utf-8", "gb2312" ];
                (n.includes("gb") || n.includes("gbk") || n.includes("gb2312")) && (r = [ "gb2312", "utf-8" ]);
                let a = !1;
                for (const t of r) try {
                    const n = new TextDecoder(t).decode(e);
                    if (n && n.length > 0 && !n.includes("�")) {
                        h = n, a = !0;
                        break;
                    }
                    if (n && n.length > 0) continue;
                } catch (e) {
                    continue;
                }
                if (a || (h = await u.text()), !h || 0 === h.trim().length) return;
            } catch (e) {
                return void console.error("Failed to decode response:", e);
            }
            let f = h;
            const d = "string" == typeof h ? h.replace(/\s/g, "") : "";
            if (d.length > 0 && d.length % 4 == 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(d)) try {
                const e = new Uint8Array(atob(d).split("").map(e => e.charCodeAt(0)));
                f = new TextDecoder("utf-8").decode(e);
            } catch {}
            if (f.split("#")[0].includes("://")) {
                if (c) {
                    const e = f.replace(/([a-z][a-z0-9+\-.]*:\/\/[^\r\n]*?)(\r?\n|$)/gi, (e, t, n) => `${t.includes("#") ? `${t}${encodeURIComponent(` [${c}]`)}` : `${t}${encodeURIComponent(`#[${c}]`)}`}${n}`);
                    s += e + "\n";
                } else s += f + "\n";
                return;
            }
            const g = h.trim().split("\n").map(e => e.trim()).filter(e => e), y = g.length > 1 && g[0].includes(","), p = /^[^\[\]]*:[^\[\]]*:[^\[\]]/, w = new URL(i);
            if (y) {
                const e = g[0].split(",").map(e => e.trim()), n = g.slice(1);
                if (e.includes("IP地址") && e.includes("端口") && e.includes("数据中心")) {
                    const t = e.indexOf("IP地址"), s = e.indexOf("端口"), o = e.indexOf("国家") > -1 ? e.indexOf("国家") : e.indexOf("城市") > -1 ? e.indexOf("城市") : e.indexOf("数据中心"), i = e.indexOf("TLS");
                    n.forEach(e => {
                        const n = e.split(",").map(e => e.trim());
                        if (-1 !== i && "true" !== n[i]?.toLowerCase()) return;
                        const u = p.test(n[t]) ? `[${n[t]}]` : n[t], h = `${u}:${n[s]}#${n[o]}`;
                        if (c) {
                            const e = `${h} [${c}]`;
                            r.add(e);
                        } else r.add(h);
                        l && a.add(`${u}:${n[s]}`);
                    });
                } else if (e.some(e => e.includes("IP")) && e.some(e => e.includes("延迟")) && e.some(e => e.includes("下载速度"))) {
                    const s = e.findIndex(e => e.includes("IP")), o = e.findIndex(e => e.includes("延迟")), i = e.findIndex(e => e.includes("下载速度")), u = w.searchParams.get("port") || t;
                    n.forEach(e => {
                        const t = e.split(",").map(e => e.trim()), n = p.test(t[s]) ? `[${t[s]}]` : t[s], h = `${n}:${u}#CF优选 ${t[o]}ms ${t[i]}MB/s`;
                        if (c) {
                            const e = `${h} [${c}]`;
                            r.add(e);
                        } else r.add(h);
                        l && a.add(`${n}:${u}`);
                    });
                }
            } else g.forEach(e => {
                const n = e.indexOf("#"), [s, o] = n > -1 ? [ e.substring(0, n), e.substring(n) ] : [ e, "" ];
                let i = !1;
                if (s.startsWith("[")) i = /\]:(\d+)$/.test(s); else {
                    const e = s.lastIndexOf(":");
                    i = e > -1 && /^\d+$/.test(s.substring(e + 1));
                }
                const u = w.searchParams.get("port") || t, h = i ? e : `${s}:${u}${o}`;
                if (c) {
                    const e = h.includes("#") ? `${h} [${c}]` : `${h}#[${c}]`;
                    r.add(e);
                } else r.add(h);
                l && a.add(h.split("#")[0]);
            });
        } catch (e) {}
    }));
    const o = s.trim() ? [ ...new Set(s.split(/\r?\n/).filter(e => "" !== e.trim())) ] : [];
    return [ Array.from(r), o, [], Array.from(a) ];
}

async function 反代参数获取(e, t, n = "", r = !0) {
    const {searchParams: a} = e, s = decodeURIComponent(e.pathname), o = s.toLowerCase();
    let i = n, c = null, l = !1, u = "", h = {}, f = r;
    const d = {
        "木马反代地址": null,
        "反代IP": i,
        "代理类型": null,
        "代理账号": "",
        "代理全局": !1,
        "代理参数": {},
        "反代兜底": f
    }, g = () => {
        d.反代IP = i, d.代理类型 = c, d.代理账号 = u, d.代理全局 = l, d.代理参数 = {
            ...h
        }, d.反代兜底 = f;
    }, y = s.match(/\/video\/(.+)$/i);
    if (y) try {
        const e = base64SecretDecode(y[1].replace(/\/+$/, ""), t), {type: n, ...r} = JSON.parse(e);
        if (!n || !反代协议默认端口[String(n).toLowerCase()]) throw new Error("链式代理类型无效");
        if (!r.hostname || !r.port) throw new Error("链式代理地址缺少 hostname 或 port");
        if (u = "", i = "链式代理", f = !1, l = !0, c = String(n).toLowerCase(), h = {
            username: r.username,
            password: r.password,
            hostname: r.hostname,
            port: Number(r.port)
        }, isNaN(h.port)) throw new Error("链式代理端口无效");
        return g(), d;
    } catch (e) {
        console.error("解析链式代理参数失败:", e.message);
    }
    u = a.get("socks5") || a.get("http") || a.get("https") || a.get("turn") || a.get("sstp") || null, 
    l = a.has("globalproxy"), a.get("socks5") ? c = "socks5" : a.get("http") ? c = "http" : a.get("https") ? c = "https" : a.get("turn") ? c = "turn" : a.get("sstp") && (c = "sstp");
    const p = (e, t = !0) => {
        const n = /^(socks5|http|https|turn|sstp):\/\/(.+)$/i.exec(e || "");
        return !!n && (c = n[1].toLowerCase(), u = n[2].split("/")[0], t && (l = !0), !0);
    }, w = e => {
        i = e, c = null, f = !1;
    }, S = /\/trojan=([^?#\s]+)/i.exec(s);
    if (S) try {
        d.木马反代地址 = 解析木马反代地址(S[1].replace(/\/+$/, ""));
    } catch (e) {
        console.error("解析木马反代地址失败:", e.message), d.木马反代地址 = null;
    }
    const m = a.get("proxyip");
    if (null !== m) {
        if (!p(m)) return w(m), g(), d;
    } else {
        let e = /\/(socks5?|http|https|turn|sstp):\/?\/?([^/?#\s]+)/i.exec(s);
        if (e) {
            const t = e[1].toLowerCase();
            c = "sock" === t || "socks" === t ? "socks5" : t, u = e[2].split("/")[0], l = !0;
        } else if (e = /\/(g?s5|socks5|g?http|g?https|g?turn|g?sstp)=([^/?#\s]+)/i.exec(s)) {
            const t = e[1].toLowerCase();
            u = e[2].split("/")[0], c = t.includes("sstp") ? "sstp" : t.includes("turn") ? "turn" : t.includes("https") ? "https" : t.includes("http") ? "http" : "socks5", 
            t.startsWith("g") && (l = !0);
        } else if (e = /\/(proxyip[.=]|pyip=|ip=)([^?#\s]+)/.exec(o)) {
            const t = (e => {
                if (!e.includes("://")) {
                    const t = e.indexOf("/");
                    return t > 0 ? e.slice(0, t) : e;
                }
                const t = e.split("://");
                if (2 !== t.length) return e;
                const n = t[1].indexOf("/");
                return n > 0 ? `${t[0]}://${t[1].slice(0, n)}` : e;
            })(e[2]);
            if (!p(t)) return w(t), g(), d;
        }
    }
    if (!u) return c = null, g(), d;
    try {
        h = await 获取SOCKS5账号(u, 获取代理默认端口(c)), c = a.get("socks5") ? "socks5" : a.get("http") ? "http" : a.get("https") ? "https" : a.get("turn") ? "turn" : a.get("sstp") ? "sstp" : c || "socks5";
    } catch (e) {
        console.error("解析SOCKS5地址失败:", e.message), c = null;
    }
    return g(), d;
}

const 反代协议默认端口 = {
    socks5: 1080,
    http: 80,
    https: 443,
    turn: 3478,
    sstp: 443
};

function 获取代理默认端口(e) {
    return 反代协议默认端口[String(e || "").toLowerCase()] || 80;
}

const SOCKS5账号Base64正则 = /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=)?$/i, IPv6方括号正则 = /^\[.*\]$/;

function 获取SOCKS5账号(e, t = 80) {
    const n = (e = String(e || "").trim().replace(/^(socks5|http|https|turn|sstp):\/\//i, "").split("#")[0].trim()).lastIndexOf("@");
    if (-1 !== n) {
        let t = e.slice(0, n).replaceAll("%3D", "=");
        !t.includes(":") && SOCKS5账号Base64正则.test(t) && (t = atob(t)), e = `${t}@${e.slice(n + 1)}`;
    }
    const r = e.lastIndexOf("@"), a = (-1 === r ? e : e.slice(r + 1)).split("/")[0], s = -1 === r ? "" : e.slice(0, r), [o, i] = s ? s.split(":") : [];
    if (s && !i) throw new Error('无效的 SOCKS 地址格式：认证部分必须是 "username:password" 的形式');
    let c = a, l = t;
    if (a.includes("]:")) {
        const [e, t = ""] = a.split("]:");
        c = e + "]", l = Number(t.replace(/[^\d]/g, ""));
    } else if (!a.startsWith("[")) {
        const e = a.split(":");
        2 === e.length && (c = e[0], l = Number(e[1].replace(/[^\d]/g, "")));
    }
    if (isNaN(l)) throw new Error("无效的 SOCKS 地址格式：端口号必须是数字");
    if (c.includes(":") && !IPv6方括号正则.test(c)) throw new Error("无效的 SOCKS 地址格式：IPv6 地址必须用方括号括起来，如 [2001:db8::1]");
    return {
        username: o,
        password: i,
        hostname: c,
        port: l
    };
}

async function getCloudflareUsage(e, t, n, r) {
    const a = "https://api.cloudflare.com/client/v4", s = e => e?.reduce((e, t) => e + (t?.sum?.requests || 0), 0) || 0, o = {
        "Content-Type": "application/json"
    };
    try {
        if (!(n || e && t)) return {
            success: !1,
            pages: 0,
            workers: 0,
            total: 0,
            max: 1e5
        };
        if (!n) {
            const r = await fetch(`${a}/accounts`, {
                method: "GET",
                headers: {
                    ...o,
                    "X-AUTH-EMAIL": e,
                    "X-AUTH-KEY": t
                }
            });
            if (!r.ok) throw new Error(`账户获取失败: ${r.status}`);
            const s = await r.json();
            if (!s?.result?.length) throw new Error("未找到账户");
            const i = s.result.findIndex(t => t.name?.toLowerCase().startsWith(e.toLowerCase()));
            n = s.result[i >= 0 ? i : 0]?.id;
        }
        const i = new Date;
        i.setUTCHours(0, 0, 0, 0);
        const c = r ? {
            ...o,
            Authorization: `Bearer ${r}`
        } : {
            ...o,
            "X-AUTH-EMAIL": e,
            "X-AUTH-KEY": t
        }, l = await fetch(`${a}/graphql`, {
            method: "POST",
            headers: c,
            body: JSON.stringify({
                query: "query getBillingMetrics($AccountID: String!, $filter: AccountWorkersInvocationsAdaptiveFilter_InputObject) {\n\t\t\t\t\tviewer { accounts(filter: {accountTag: $AccountID}) {\n\t\t\t\t\t\tpagesFunctionsInvocationsAdaptiveGroups(limit: 1000, filter: $filter) { sum { requests } }\n\t\t\t\t\t\tworkersInvocationsAdaptive(limit: 10000, filter: $filter) { sum { requests } }\n\t\t\t\t\t} }\n\t\t\t\t}",
                variables: {
                    AccountID: n,
                    filter: {
                        datetime_geq: i.toISOString(),
                        datetime_leq: (new Date).toISOString()
                    }
                }
            })
        });
        if (!l.ok) throw new Error(`查询失败: ${l.status}`);
        const u = await l.json();
        if (u.errors?.length) throw new Error(u.errors[0].message);
        const h = u?.data?.viewer?.accounts?.[0];
        if (!h) throw new Error("未找到账户数据");
        const f = s(h.pagesFunctionsInvocationsAdaptiveGroups), d = s(h.workersInvocationsAdaptive), g = f + d, y = 1e5;
        return log(`统计结果 - Pages: ${f}, Workers: ${d}, 总计: ${g}, 上限: 100000`), {
            success: !0,
            pages: f,
            workers: d,
            total: g,
            max: y
        };
    } catch (e) {
        return console.error("获取使用量错误:", e.message), {
            success: !1,
            pages: 0,
            workers: 0,
            total: 0,
            max: 1e5
        };
    }
}

function sha224(e) {
    const t = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ], n = (e, t) => (e >>> t | e << 32 - t) >>> 0, r = 8 * (e = unescape(encodeURIComponent(e))).length;
    for (e += String.fromCharCode(128); 8 * e.length % 512 != 448; ) e += String.fromCharCode(0);
    const a = [ 3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428 ], s = Math.floor(r / 4294967296), o = 4294967295 & r;
    e += String.fromCharCode(s >>> 24 & 255, s >>> 16 & 255, s >>> 8 & 255, 255 & s, o >>> 24 & 255, o >>> 16 & 255, o >>> 8 & 255, 255 & o);
    const i = [];
    for (let t = 0; t < e.length; t += 4) i.push(e.charCodeAt(t) << 24 | e.charCodeAt(t + 1) << 16 | e.charCodeAt(t + 2) << 8 | e.charCodeAt(t + 3));
    for (let e = 0; e < i.length; e += 16) {
        const r = new Array(64).fill(0);
        for (let t = 0; t < 16; t++) r[t] = i[e + t];
        for (let e = 16; e < 64; e++) {
            const t = n(r[e - 15], 7) ^ n(r[e - 15], 18) ^ r[e - 15] >>> 3, a = n(r[e - 2], 17) ^ n(r[e - 2], 19) ^ r[e - 2] >>> 10;
            r[e] = r[e - 16] + t + r[e - 7] + a >>> 0;
        }
        let [s, o, c, l, u, h, f, d] = a;
        for (let e = 0; e < 64; e++) {
            const a = d + (n(u, 6) ^ n(u, 11) ^ n(u, 25)) + (u & h ^ ~u & f) + t[e] + r[e] >>> 0, i = s & o ^ s & c ^ o & c;
            d = f, f = h, h = u, u = l + a >>> 0, l = c, c = o, o = s, s = a + ((n(s, 2) ^ n(s, 13) ^ n(s, 22)) + i >>> 0) >>> 0;
        }
        for (let e = 0; e < 8; e++) a[e] = a[e] + (0 === e ? s : 1 === e ? o : 2 === e ? c : 3 === e ? l : 4 === e ? u : 5 === e ? h : 6 === e ? f : d) >>> 0;
    }
    let c = "";
    for (let e = 0; e < 7; e++) for (let t = 24; t >= 0; t -= 8) c += (a[e] >>> t & 255).toString(16).padStart(2, "0");
    return c;
}

async function 解析地址端口(e, t = "dash.cloudflare.com", n = "00000000-0000-4000-8000-000000000000") {
    function r(e) {
        let t = e, n = 443;
        if (e.includes("]:")) {
            const r = e.split("]:");
            t = r[0] + "]", n = parseInt(r[1], 10) || n;
        } else if (1 === (e.match(/:/g) || []).length && !e.startsWith("[")) {
            const r = e.lastIndexOf(":");
            t = e.slice(0, r), n = parseInt(e.slice(r + 1), 10) || n;
        }
        return [ t, n ];
    }
    function a(e) {
        return e.flatMap(e => (e.startsWith('"') && e.endsWith('"') && (e = e.slice(1, -1)), 
        e.replace(/\\010/g, ",").replace(/\n/g, ",").split(",").map(e => e.trim()).filter(Boolean))).map(e => r(e));
    }
    e = e.toLowerCase();
    const s = await 整理成数组(e);
    let o = [];
    const i = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/, c = /^\[?(?:[a-fA-F0-9]{0,4}:){1,7}[a-fA-F0-9]{0,4}\]?$/;
    for (const e of s) {
        let [t, n] = r(e);
        if (e.includes(".tp")) {
            const t = e.match(/\.tp(\d+)/);
            t && (n = parseInt(t[1], 10));
        }
        if (i.test(t) || c.test(t)) {
            log(`[反代解析] ${t} 为IP地址，直接使用`), o.push([ t, n ]);
            continue;
        }
        const [s, l] = await Promise.all([ DoH查询(t, "TXT"), DoH查询(t, "A") ]), u = a(s.filter(e => 16 === e.type).map(e => e.data));
        if (u.length > 0) {
            log(`[反代解析] ${t} 使用TXT记录，共${u.length}个结果`), o.push(...u);
            continue;
        }
        const h = l.filter(e => 1 === e.type).map(e => e.data);
        if (h.length > 0) {
            log(`[反代解析] ${t} 未获取到TXT记录，使用A记录，共${h.length}个结果`), o.push(...h.map(e => [ e, n ]));
            continue;
        }
        const f = (await DoH查询(t, "AAAA")).filter(e => 28 === e.type).map(e => `[${e.data}]`);
        f.length > 0 ? (log(`[反代解析] ${t} 未获取到TXT和A记录，使用AAAA记录，共${f.length}个结果`), o.push(...f.map(e => [ e, n ]))) : (log(`[反代解析] ${t} 未获取到TXT、A和AAAA记录，保留原域名`), 
        o.push([ t, n ]));
    }
    const l = o.sort((e, t) => e[0].localeCompare(t[0])), u = t.includes(".") ? t.split(".").slice(-2).join(".") : t;
    let h = [ ...u + n ].reduce((e, t) => e + t.charCodeAt(0), 0);
    log(`[反代解析] 随机种子: ${h}\n目标站点: ${u}`);
    const f = [ ...l ].sort(() => (h = 1103515245 * h + 12345 & 2147483647) / 2147483647 - .5).slice(0, 8);
    return log(`[反代解析] 解析完成 总数: ${f.length}个\n${f.map(([e, t], n) => `${n + 1}. ${e}:${t}`).join("\n")}`), 
    f;
}

async function nginx() {
    return '\n\t<!DOCTYPE html>\n\t<html>\n\t<head>\n\t<title>Welcome to nginx!</title>\n\t<style>\n\t\tbody {\n\t\t\twidth: 35em;\n\t\t\tmargin: 0 auto;\n\t\t\tfont-family: Tahoma, Verdana, Arial, sans-serif;\n\t\t}\n\t</style>\n\t</head>\n\t<body>\n\t<h1>Welcome to nginx!</h1>\n\t<p>If you see this page, the nginx web server is successfully installed and\n\tworking. Further configuration is required.</p>\n\n\t<p>For online documentation and support please refer to\n\t<a href="http://nginx.org/">nginx.org</a>.<br/>\n\tCommercial support is available at\n\t<a href="http://nginx.com/">nginx.com</a>.</p>\n\n\t<p><em>Thank you for using nginx.</em></p>\n\t</body>\n\t</html>\n\t';
}

async function html1101(e, t) {
    const n = new Date, r = n.getFullYear() + "-" + String(n.getMonth() + 1).padStart(2, "0") + "-" + String(n.getDate()).padStart(2, "0") + " " + String(n.getHours()).padStart(2, "0") + ":" + String(n.getMinutes()).padStart(2, "0") + ":" + String(n.getSeconds()).padStart(2, "0"), a = Array.from(crypto.getRandomValues(new Uint8Array(8))).map(e => e.toString(16).padStart(2, "0")).join("");
    return `<!DOCTYPE html>\n\x3c!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en-US"> <![endif]--\x3e\n\x3c!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en-US"> <![endif]--\x3e\n\x3c!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en-US"> <![endif]--\x3e\n\x3c!--[if gt IE 8]>\x3c!--\x3e <html class="no-js" lang="en-US"> \x3c!--<![endif]--\x3e\n<head>\n<title>Worker threw exception | ${e} | Cloudflare</title>\n<meta charset="UTF-8" />\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n<meta http-equiv="X-UA-Compatible" content="IE=Edge" />\n<meta name="robots" content="noindex, nofollow" />\n<meta name="viewport" content="width=device-width,initial-scale=1" />\n<link rel="stylesheet" id="cf_styles-css" href="/cdn-cgi/styles/cf.errors.css" />\n\x3c!--[if lt IE 9]><link rel="stylesheet" id='cf_styles-ie-css' href="/cdn-cgi/styles/cf.errors.ie.css" /><![endif]--\x3e\n<style>body{margin:0;padding:0}</style>\n\n\n\x3c!--[if gte IE 10]>\x3c!--\x3e\n<script>\n  if (!navigator.cookieEnabled) {\n    window.addEventListener('DOMContentLoaded', function () {\n      var cookieEl = document.getElementById('cookie-alert');\n      cookieEl.style.display = 'block';\n    })\n  }\n<\/script>\n\x3c!--<![endif]--\x3e\n\n</head>\n<body>\n    <div id="cf-wrapper">\n        <div class="cf-alert cf-alert-error cf-cookie-error" id="cookie-alert" data-translate="enable_cookies">Please enable cookies.</div>\n        <div id="cf-error-details" class="cf-error-details-wrapper">\n            <div class="cf-wrapper cf-header cf-error-overview">\n                <h1>\n                    <span class="cf-error-type" data-translate="error">Error</span>\n                    <span class="cf-error-code">1101</span>\n                    <small class="heading-ray-id">Ray ID: ${a} &bull; ${r} UTC</small>\n                </h1>\n                <h2 class="cf-subheadline" data-translate="error_desc">Worker threw exception</h2>\n            </div>\x3c!-- /.header --\x3e\n\n            <section></section>\x3c!-- spacer --\x3e\n\n            <div class="cf-section cf-wrapper">\n                <div class="cf-columns two">\n                    <div class="cf-column">\n                        <h2 data-translate="what_happened">What happened?</h2>\n                            <p>You've requested a page on a website (${e}) that is on the <a href="https://www.cloudflare.com/5xx-error-landing?utm_source=error_100x" target="_blank">Cloudflare</a> network. An unknown error occurred while rendering the page.</p>\n                    </div>\n\n                    <div class="cf-column">\n                        <h2 data-translate="what_can_i_do">What can I do?</h2>\n                            <p><strong>If you are the owner of this website:</strong><br />refer to <a href="https://developers.cloudflare.com/workers/observability/errors/" target="_blank">Workers - Errors and Exceptions</a> and check Workers Logs for ${e}.</p>\n                    </div>\n\n                </div>\n            </div>\x3c!-- /.section --\x3e\n\n            <div class="cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300">\n    <p class="text-13">\n      <span class="cf-footer-item sm:block sm:mb-1">Cloudflare Ray ID: <strong class="font-semibold"> ${a}</strong></span>\n      <span class="cf-footer-separator sm:hidden">&bull;</span>\n      <span id="cf-footer-item-ip" class="cf-footer-item hidden sm:block sm:mb-1">\n        Your IP:\n        <button type="button" id="cf-footer-ip-reveal" class="cf-footer-ip-reveal-btn">Click to reveal</button>\n        <span class="hidden" id="cf-footer-ip">${t}</span>\n        <span class="cf-footer-separator sm:hidden">&bull;</span>\n      </span>\n      <span class="cf-footer-item sm:block sm:mb-1"><span>Performance &amp; security by</span> <a rel="noopener noreferrer" href="https://www.cloudflare.com/5xx-error-landing" id="brand_link" target="_blank">Cloudflare</a></span>\n\n    </p>\n    <script>(function(){function d(){var b=a.getElementById("cf-footer-item-ip"),c=a.getElementById("cf-footer-ip-reveal");b&&"classList"in b&&(b.classList.remove("hidden"),c.addEventListener("click",function(){c.classList.add("hidden");a.getElementById("cf-footer-ip").classList.remove("hidden")}))}var a=document;document.addEventListener&&a.addEventListener("DOMContentLoaded",d)})();<\/script>\n  </div>\x3c!-- /.error-footer --\x3e\n\n        </div>\x3c!-- /#cf-error-details --\x3e\n    </div>\x3c!-- /#cf-wrapper --\x3e\n\n     <script>\n    window._cf_translation = {};\n\n\n  <\/script>\n</body>\n</html>`;
}
