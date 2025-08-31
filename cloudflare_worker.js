export default {
  async fetch(request) {
    const corsHeaders = {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
    const corsOptionsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Max-Age": "86400",
    };

    async function handleRequest(request) {
      const url = new URL(request.url);
      let api_pos = url.origin.length + 1;
      let api = url.href.substring(api_pos);
      let proxy_url = url.href;
      let proxy = "";
      let proxy_enc = "";
      let enc = "";
      let ip = "";
      let redirect = request.method === "POST" ? "manual" : "follow";
      let get_cookie = false;
      let cookie_plus = false;
      let get_redirect = false;
      let force_head = false;
      let remove_compression = false;
      let params = [];
      let cdn_info = "cdn_X8v8IbU8";
      let user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36";

      if (api === "headers") {
        let body = "";
        request.headers.forEach((value, key) => body += key + " = " + value + "\n");
        body += "request_url" + " = " + request.url + "\n";
        body += "worker_version = 1.14\n";
        return new Response(body, corsHeaders);
      }

      let real_ip = "";
      let forwarded_for = request.headers.get("X-Forwarded-For");
      if (forwarded_for) real_ip = forwarded_for.split(",").map(s=>s.trim()).find(s=>s && !s.match(/^(127\.|10\.|172\.1[6-9]|172\.2[0-9]|172\.3[01]|192\.168\.)/)) || "";
      if (!real_ip) real_ip = request.headers.get("cf-connecting-ip");
      if (!real_ip) real_ip = request.headers.get("X-Real-IP");

      if (api === "jsonip") {
          return new Response(JSON.stringify({ip: real_ip}), {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Vary": "Origin",
              "Content-Type": "application/json; charset=utf-8",
            },
          });
      }

      if (api.startsWith("?")) {
        api_pos += 1;
        api = api.substring(1);
      }

      let next_param = true;
      while (next_param) {
        if (api.startsWith("ip")) {
          let pos = api.indexOf("/");
          if (pos !== -1) {
            ip = api.substring(2, pos);
            api_pos += pos + 1;
            api = api.substring(pos + 1);
          } else {
            ip = api.substring(2);
            api_pos += api.length;
            api = "";
          }
        } else if (api.startsWith("redirect=")) {
          let pos = api.indexOf("/");
          if (pos !== -1) {
            redirect = api.substring(9, pos);
            api_pos += pos + 1;
            api = api.substring(pos + 1);
          } else {
            redirect = api.substring(9);
            api_pos += api.length;
            api = "";
          }
        } else if (api.startsWith("get_cookie/")) {
          get_cookie = true;
          api_pos += 11;
          api = api.substring(11);
        } else if (api.startsWith("cookie_plus/")) {
          cookie_plus = true;
          remove_compression = true;
          api_pos += 12;
          api = api.substring(12);
        } else if (api.startsWith("get_redirect/")) {
          get_redirect = true;
          redirect = "manual";
          api_pos += 13;
          api = api.substring(13);
        } else if (api.startsWith("head/")) {
          force_head = true;
          api_pos += 5;
          api = api.substring(5);
        } else if (api.startsWith("param?") || api.startsWith("param/")) {
          api_pos += 6;
          api = api.substring(6);
          let param;
          let pos = api.indexOf("/");
          if (pos !== -1) {
            param = api.substring(0, pos);
            api_pos += pos + 1;
            api = api.substring(pos + 1);
          } else {
            param = api.substring(0);
            api_pos += api.length;
            api = "";
          }
          pos = param.indexOf("=");
          if (pos !== -1) {
            params.push([param.substring(0, pos), param.substring(pos + 1)]);
          } else {
            params.push([param]);
          }
        } else if (api.startsWith("enc/") || api.startsWith("enc1/") || api.startsWith("enc2/")) {
          let cur_enc = api.substring(0, api.indexOf("/"));
          if (enc) {
            proxy_enc += proxy_url.substring(0, api_pos);
          } else {
            proxy += proxy_url.substring(0, api_pos);
            enc = cur_enc;
          }
          api = api.substring(cur_enc.length + 1);
          let pos = api.indexOf("/");
          if (pos !== -1) {
            api = atob(decodeURIComponent(api.substring(0, pos))) + (cur_enc === "enc2" ? "" : api.substring(pos + 1));
          } else {
            api = atob(decodeURIComponent(api.substring(0)));
          }
          proxy_url = api;
          api_pos = 0;
        } else {
          next_param = false;
        }
      }

      if (enc) {
        proxy_enc += proxy_url.substring(0, api_pos);
      } else {
        proxy += proxy_url.substring(0, api_pos);
      }

      let forwarded_proto = request.headers.get("X-Forwarded-Proto");
      if (forwarded_proto) forwarded_proto = forwarded_proto.split(",")[0].trim();
      if (forwarded_proto === "https") proxy = proxy.replace("http://", "https://");

      if (!ip) ip = real_ip;

      if (!api || !/^https?:\/\/[^\/]/.test(api)) {
        let error = "Malformed URL";
        return new Response(error + ": " + api, {
          ...corsHeaders,
          status: 404,
          statusText: error,
        });
      }
      const apiUrl = new URL(api);
      let apiBase = apiUrl.href.substring(0, apiUrl.href.lastIndexOf("/") + 1);

      // Rewrite request to point to API URL. This also makes the request mutable
      // so you can add the correct Origin header to make the API server think
      // that this request is not cross-site.
      request = new Request(api, request);
      if (force_head) {
        request = new Request(request, {method: "HEAD"});
      }

      let cdn_loop = request.headers.get("CDN-Loop");
      if (cdn_loop && cdn_loop.indexOf(cdn_info) !== -1) {
        let error = "CDN-Loop detected";
        return new Response(error, {
          ...corsHeaders,
          status: 403,
          statusText: error,
        });
      } else {
        request.headers.append("CDN-Loop", cdn_info);
      }

      request.headers.set("Origin", apiUrl.origin);
      request.headers.set("Referer", apiUrl.origin + "/");
      if (true) {
        request.headers.delete("Sec-Fetch-Dest");
        request.headers.delete("Sec-Fetch-Mode");
        request.headers.delete("Sec-Fetch-Site");
        request.headers.delete("Sec-Fetch-User");
        request.headers.delete("Sec-CH-UA");
        request.headers.delete("Sec-CH-UA-Mobile");
        request.headers.delete("Sec-CH-UA-Platform");
        request.headers.delete("Host");
      }
      if (true) {
        request.headers.delete("X-Forwarded-For");
        request.headers.delete("X-Forwarded-Proto");
        //request.headers.delete("X-Real-IP");
        //request.headers.delete("cf-connecting-ip");
        request.headers.delete("cf-ipcountry");
        request.headers.delete("cf-ray");
        request.headers.delete("cf-visitor");
      }
      if (ip && ip !== "no") {
        //request.headers.set("X-Forwarded-For", ip);
        //request.headers.set("X-Forwarded-Proto", "https");
        request.headers.set("X-Real-IP", ip);
        request.headers.set("cf-connecting-ip", ip);
      }
      if (apiUrl.hostname === "rezka.ag" || apiUrl.hostname === "hdrezka.ag" || apiUrl.hostname === "hdrezka.me" || apiUrl.hostname === "hdrezka.sh" || apiUrl.hostname === "hdrezka.cm" || apiUrl.hostname === "hdrezka.kim" || apiUrl.hostname === "hdrezka.la" || apiUrl.hostname === "rezka.pub" || apiUrl.hostname === "kinopub.me") {
        request.headers.set("User-Agent", user_agent);
      }
      if (apiUrl.hostname.endsWith(".svetacdn.in")) {
        request.headers.set("Origin", "https://videocdn.tv");
        request.headers.set("Referer", "https://videocdn.tv/");
      }
      if (apiUrl.hostname === "api.lumex.pw") {
        request.headers.set("User-Agent", user_agent);
        request.headers.set("Origin", "https://p.lumex.pw");
        request.headers.set("Referer", "https://p.lumex.pw/");
        request.headers.set("Sec-Fetch-Dest", "empty");
        request.headers.set("Sec-Fetch-Mode", "cors");
        request.headers.set("Sec-Fetch-Site", "same-site");
      }
      if (apiUrl.hostname.endsWith("cdnmovies-stream.online") || apiUrl.hostname.endsWith("cdnmovies-hls-stream.online") || apiUrl.hostname.endsWith(".sarnage.cc")) {
        request.headers.set("Origin", "https://cdnmovies.net");
        request.headers.set("Referer", "https://cdnmovies.net/");
      }
      if (apiUrl.hostname.endsWith(".bazon.site")) {
        request.headers.set("User-Agent", user_agent);
        request.headers.set("Origin", "https://bazon.cc");
        request.headers.set("Referer", "https://bazon.cc/");
      }
      if (["kodikapi.com", "kodik.biz", "kodik.info"].indexOf(apiUrl.hostname) !== -1) {
        request.headers.delete("Origin");
        request.headers.delete("Referer");
      }
      if (apiUrl.hostname === "kinoplay.site" || apiUrl.hostname === "kinoplay1.site" || apiUrl.hostname === "kinoplay2.site") {
        request.headers.set("Cookie", "invite=a246a3f46c82fe439a45c3dbbbb24ad5");
      }
      if (remove_compression) {
        let encoding = (request.headers.get("Accept-Encoding") || "");
        if (encoding.includes("zstd") || encoding.includes("deflate")) {
          encoding = encoding.split(",").filter(enc=>!(enc.includes("zstd") || enc.includes("deflate"))).join(",") || "identity";
          request.headers.set("Accept-Encoding", encoding);
        }
      }
      params.forEach(param => {
        if (param[0]) {
          if (param[1]) {
            request.headers.set(decodeURIComponent(param[0]), decodeURIComponent(param[1] || ""));
          } else {
            request.headers.delete(decodeURIComponent(param[0]));
          }
        }
      });
      let response = await fetch(request, {
        redirect: redirect,
      });
      let currentUrl = response.url;

      // Recreate the response so you can modify the headers
      response = new Response(response.body, response);

      // Set CORS headers
      response.headers.set("Access-Control-Allow-Origin", "*");

      // Append to/Add Vary header so browser will cache response correctly
      response.headers.append("Vary", "Origin");

      if (response.status >= 200 && response.status < (get_redirect ? 400 : 300)) {
        let ctype = (response.headers.get("Content-Type") || "").split(";")[0].toLowerCase();
        if (get_cookie || cookie_plus || get_redirect) {
          let json = {};
          json.currentUrl = currentUrl;
          if (get_redirect) {
            let target = response.headers.get("Location");
            if (target) {
                json.redirectUrl = fixLink(target, apiUrl, apiBase);
                response.headers.set("Location", json.redirectUrl);
            }
          }
          if (get_cookie || cookie_plus) {
            json.cookie = response.headers.getSetCookie();
          }
          if (cookie_plus) {
            let headers = {};
            for (let key of response.headers.keys()) {
              if (key === "set-cookie") {
                headers[key] = json.cookie;
              } else {
                headers[key] = response.headers.get(key);
              }
            }
            json.headers = headers;
            if (ctype.startsWith("text/") || ["application/json", "application/xml", "application/x-mpegurl", "application/vnd.apple.mpegurl", "application/dash+xml"].indexOf(ctype) !== -1) {
              json.body = await response.text();
            }
          }
          return new Response(JSON.stringify(json), {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Vary": "Origin",
              "Content-Type": "application/json; charset=utf-8",
            },
          });
        }
      }

      // Fix redirect URL
      if (response.status >= 300 && response.status < 400) {
        let target = response.headers.get("Location");
        if (target) {
          response.headers.set("Location", proxyLink(fixLink(target, apiUrl, apiBase), proxy, proxy_enc, enc));
        }
      }

      return response;
    }

    function fixLink(link, url, base) {
      if (link) {
        if (link.indexOf("://") !== -1) return link;
        if (link.startsWith("//")) return url.protocol + link;
        if (link.startsWith("/")) return url.origin + link;
        if (link.startsWith("?")) return url.origin + url.pathname + link;
        if (link.startsWith("#")) return url.origin + url.pathname + url.search + link;
        return base + link;
      }
      return link;
    }

    function proxyLink(link, proxy, proxy_enc, enc) {
      if (link) {
        if (enc === "enc") {
          let pos = link.indexOf("/");
          if (pos !== -1 && link.charAt(pos + 1) === "/") pos++;
          let part1 = pos !== -1 ? link.substring(0, pos + 1) : "";
          let part2 = pos !== -1 ? link.substring(pos + 1) : link;
          return proxy + "enc/" + encodeURIComponent(btoa(proxy_enc + part1)) + "/" + part2;
        }
        if (enc === "enc1") {
          let pos = link.lastIndexOf("/");
          let part1 = pos !== -1 ? link.substring(0, pos + 1) : "";
          let part2 = pos !== -1 ? link.substring(pos + 1) : link;
          return proxy + "enc1/" + encodeURIComponent(btoa(proxy_enc + part1)) + "/" + part2;
        }
        if (enc === "enc2") {
          let posEnd = link.lastIndexOf("?");
          let posStart = link.lastIndexOf("://");
          if (posEnd === -1 || posEnd <= posStart) posEnd = link.length;
          if (posStart === -1) posStart = -3;
          let name = link.substring(posStart + 3, posEnd);
          posStart = name.lastIndexOf("/");
          name = posStart !== -1 ? name.substring(posStart + 1) : "";
          return proxy + "enc2/" + encodeURIComponent(btoa(proxy_enc + link)) + "/" + name;
        }
        return proxy + proxy_enc + link;
      }
      return link;
    }

    async function handleOptions(request) {
      if (
        request.headers.get("Origin") !== null &&
        request.headers.get("Access-Control-Request-Method") !== null &&
        request.headers.get("Access-Control-Request-Headers") !== null
      ) {
        // Handle CORS preflight requests.
        return new Response(null, {
          headers: {
            ...corsOptionsHeaders,
            "Access-Control-Allow-Headers": request.headers.get(
              "Access-Control-Request-Headers"
            ),
          },
        });
      } else {
        // Handle standard OPTIONS request.
        return new Response(null, {
          headers: {
            Allow: "GET, HEAD, POST, OPTIONS",
          },
        });
      }
    }

    try {
      if (request.method === "OPTIONS") {
        // Handle CORS preflight requests
        return await handleOptions(request);
      } else if (
        request.method === "GET" ||
        request.method === "HEAD" ||
        request.method === "POST"
      ) {
        // Handle requests to the API server
        return await handleRequest(request);
      } else {
        let error = "Method Not Allowed";
        return new Response(error + ": " + request.method, {
          ...corsHeaders,
          status: 405,
          statusText: error,
        });
      }
    } catch (err) {
      let error = "Internal Server Error";
      return new Response(error + ": " + err + "\n" + (err.stack || ""), {
          ...corsHeaders,
        status: 500,
        statusText: error,
      });
    }
  },
};