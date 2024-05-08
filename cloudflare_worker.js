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
      let ip = "";
      let redirect = request.method === "POST" ? "manual" : "follow";
      let get_cookie = false;
      let params = [];
      let cdn_info = "cdn_X8v8IbU8";

      if (api === "headers") {
        let body = "";
        request.headers.forEach((value, key) => body += key + " = " + value + "\n");
        body += "request_url" + " = " + request.url + "\n";
        body += "worker_version = 1.03\n";
        return new Response(body, corsHeaders);
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
          params.push(param.split("="));
        } else {
          next_param = false;
        }
      }

      let proxy = url.href.substring(0, api_pos);

      let forwarded_proto = request.headers.get("X-Forwarded-Proto");
      if (forwarded_proto) forwarded_proto = forwarded_proto.split(",")[0].trim();
      if (forwarded_proto === "https") proxy = proxy.replace('http://', 'https://');

      if (!ip) {
        let forwarded_for = request.headers.get("X-Forwarded-For");
        if (forwarded_for) ip = forwarded_for.split(",")[0].trim();
      }
      if (!ip) ip = request.headers.get("cf-connecting-ip");
      if (!ip) ip = request.headers.get("X-Real-IP");

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
      if (ip) {
        //request.headers.set("X-Forwarded-For", ip);
        //request.headers.set("X-Forwarded-Proto", "https");
        request.headers.set("X-Real-IP", ip);
        request.headers.set("cf-connecting-ip", ip);
      }
      if (apiUrl.hostname === "rezka.ag" || apiUrl.hostname === "hdrezka.ag" || apiUrl.hostname === "hdrezka.me" || apiUrl.hostname === "hdrezka.sh" || apiUrl.hostname === "hdrezka.cm" || apiUrl.hostname === "hdrezka.kim" || apiUrl.hostname === "hdrezka.la" || apiUrl.hostname === "rezka.pub" || apiUrl.hostname === "kinopub.me") {
        request.headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36");
      }
      if (apiUrl.hostname.endsWith(".svetacdn.in")) {
        request.headers.set("Origin", "https://videocdn.tv");
        request.headers.set("Referer", "https://videocdn.tv/");
      }
      if (apiUrl.hostname.endsWith("cdnmovies-stream.online") || apiUrl.hostname.endsWith("cdnmovies-hls-stream.online") || apiUrl.hostname.endsWith(".sarnage.cc")) {
        request.headers.set("Origin", "https://cdnmovies.net");
        request.headers.set("Referer", "https://cdnmovies.net/");
      }
      if (apiUrl.hostname.endsWith(".bazon.site")) {
        request.headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36");
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

      // Recreate the response so you can modify the headers
      response = new Response(response.body, response);

      // Set CORS headers
      response.headers.set("Access-Control-Allow-Origin", "*");

      // Append to/Add Vary header so browser will cache response correctly
      response.headers.append("Vary", "Origin");

      if (response.status >= 200 && response.status < 300) {
        if (get_cookie) {
          let json = {};
          json.cookie = response.headers.getSetCookie();
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
          response.headers.set("Location", fixLink(target, proxy, apiUrl, apiBase));
        }
      }

      return response;
    }

    function fixLink(link, proxy, url, base) {
      if (link) {
        if (link.indexOf("://") !== -1) return proxy + link;
        if (link.startsWith("//")) return proxy + url.protocol + link;
        if (link.startsWith("/")) return proxy + url.origin + link;
        if (link.startsWith("?")) return proxy + url.origin + url.pathname + link;
        if (link.startsWith("#")) return proxy + url.origin + url.pathname + url.search + link;
        return proxy + base + link;
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