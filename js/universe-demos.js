/* ==========================================================================
   SOFTZONE TECH UNIVERSE - INTERACTIVE STATION DEMOS
   ========================================================================== */

(function() {
  const demos = {
    // --------------------------------------------------------------------------
    // AI ECOSYSTEM DEMOS
    // --------------------------------------------------------------------------
    "ai-content": {
      render: () => `
        <div class="demo-stage-wrapper">
          <label class="form-label" style="font-size:0.8rem;">Nhập từ khóa chủ đề bài viết:</label>
          <div style="display:flex; gap:8px;">
            <input type="text" class="form-control" id="demo-content-input" placeholder="Ví dụ: phần mềm tự động hóa" style="padding: 6px 12px; font-size:0.85rem;">
            <button class="btn btn-cyan btn-sm" id="demo-content-btn" style="padding:0 16px;">Viết bài</button>
          </div>
          <div class="demo-output-terminal" id="demo-content-output" style="margin-top:10px; display:none;"></div>
        </div>
      `,
      bind: () => {
        const btn = document.getElementById("demo-content-btn");
        const input = document.getElementById("demo-content-input");
        const output = document.getElementById("demo-content-output");

        btn.onclick = () => {
          const val = input.value.trim() || "phần mềm tự động hóa";
          output.style.display = "block";
          output.innerHTML = `🤖 AI Writer đang phân tích từ khóa "${val}"...`;
          
          setTimeout(() => {
            output.innerHTML = `
              <div style="color:var(--green); font-weight:600; margin-bottom:6px;">[HOÀN TẤT] Sinh tiêu đề thành công:</div>
              <div style="margin-bottom:6px;">1. 💥 X5 hiệu suất văn phòng nhờ áp dụng <strong>${val}</strong> của KDG!</div>
              <div style="margin-bottom:6px;">2. Tiết lộ bí mật đằng sau hệ thống <strong>${val}</strong> chạy tự động.</div>
              <div>3. Tại sao doanh nghiệp nhỏ cần đầu tư <strong>${val}</strong> năm 2026?</div>
            `;
          }, 800);
        };
      }
    },

    "ai-chatbot": {
      render: () => `
        <div class="demo-stage-wrapper">
          <div class="demo-output-terminal" id="demo-chatbot-log" style="height:120px; font-size:0.75rem; display:flex; flex-direction:column; gap:6px;">
            <div style="color:var(--text-muted);">[AI]: Chào bạn! Tôi là Synthetix AI Agent. Bạn muốn hỏi gì?</div>
          </div>
          <div style="display:flex; gap:8px; margin-top:8px;">
            <input type="text" class="form-control" id="demo-chatbot-input" placeholder="Hỏi về 'giá', 'chính sách'..." style="padding: 6px 12px; font-size:0.85rem;">
            <button class="btn btn-cyan btn-sm" id="demo-chatbot-btn" style="padding:0 16px;">Gửi</button>
          </div>
        </div>
      `,
      bind: () => {
        const btn = document.getElementById("demo-chatbot-btn");
        const input = document.getElementById("demo-chatbot-input");
        const log = document.getElementById("demo-chatbot-log");

        btn.onclick = () => {
          const val = input.value.trim().toLowerCase();
          if (val === "") return;

          // User message
          const uDiv = document.createElement("div");
          uDiv.style.color = "var(--cyan)";
          uDiv.innerHTML = `[User]: ${input.value}`;
          log.appendChild(uDiv);
          input.value = "";
          log.scrollTop = log.scrollHeight;

          setTimeout(() => {
            const aiDiv = document.createElement("div");
            aiDiv.style.color = "var(--green)";
            
            // Basic reply matrix
            if (val.includes("giá") || val.includes("bao nhiêu")) {
              aiDiv.innerHTML = `[AI]: Giá thuê bao KDG chỉ từ $9/tháng. Mua trọn đời (Lifetime) được giảm giá tới 50% khi nhập code KDG50.`;
            } else if (val.includes("chính sách") || val.includes("hoàn tiền")) {
              aiDiv.innerHTML = `[AI]: Chúng tôi cam kết hoàn tiền 100% trong vòng 7 ngày đầu nếu phần mềm xảy ra lỗi kỹ thuật không khắc phục được.`;
            } else {
              aiDiv.innerHTML = `[AI]: Yêu cầu của bạn đã được tiếp nhận. AI Agent đang chuyển dữ liệu phân tích sang core điều phối...`;
            }
            log.appendChild(aiDiv);
            log.scrollTop = log.scrollHeight;
          }, 600);
        };
      }
    },

    "ai-coding": {
      render: () => `
        <div class="demo-stage-wrapper">
          <label class="form-label" style="font-size:0.8rem;">Đoạn code Javascript cũ (ES5):</label>
          <textarea class="form-control" id="demo-code-input" rows="3" style="font-family:monospace; font-size:0.75rem; resize:none;">var a = 1;&#10;function add(x) {&#10;  return x + a;&#10;}</textarea>
          <button class="btn btn-cyan btn-sm" id="demo-code-btn" style="margin-top:8px;">Tối ưu hóa Code</button>
          <div class="demo-output-terminal" id="demo-code-output" style="margin-top:10px; display:none; font-size:0.75rem;"></div>
        </div>
      `,
      bind: () => {
        const btn = document.getElementById("demo-code-btn");
        const input = document.getElementById("demo-code-input");
        const output = document.getElementById("demo-code-output");

        btn.onclick = () => {
          output.style.display = "block";
          output.innerHTML = `// AetherAI đang phân tích AST và tối ưu cấu trúc...`;
          
          setTimeout(() => {
            output.innerHTML = `
              <span style="color:var(--green);">// Tối ưu hóa hoàn tất (Độ trễ giảm 32%)</span><br>
              <span style="color:var(--cyan);">const</span> a = <span style="color:var(--pink);">1</span>;<br>
              <span style="color:var(--cyan);">const</span> add = (x) => x + a;
            `;
          }, 800);
        };
      }
    },

    "ai-analytics": {
      render: () => `
        <div class="demo-stage-wrapper">
          <button class="btn btn-cyan btn-sm" id="demo-chart-btn">Mô phỏng dữ liệu</button>
          <div style="width:100%; height:120px; border:1px solid var(--border-soft); border-radius:6px; background:var(--bg-deep); position:relative; margin-top:10px; overflow:hidden;" id="demo-chart-canvas-wrap">
            <svg id="demo-chart-svg" style="width:100%; height:100%; overflow:visible;"></svg>
          </div>
        </div>
      `,
      bind: () => {
        const btn = document.getElementById("demo-chart-btn");
        const svg = document.getElementById("demo-chart-svg");

        btn.onclick = () => {
          // Generate a smooth random chart path
          const width = svg.clientWidth || 340;
          const height = svg.clientHeight || 120;
          let points = [];
          
          for (let i = 0; i <= 6; i++) {
            const px = (width / 6) * i;
            const py = height * 0.7 - Math.random() * (height * 0.5);
            points.push(`${px},${py}`);
          }

          svg.innerHTML = `
            <path d="M 0,${height} L ${points.join(" L ")} L ${width},${height} Z" fill="rgba(34, 211, 238, 0.08)"/>
            <path d="M 0,${height * 0.7} L ${points.join(" L ")}" stroke="var(--cyan)" stroke-width="2" fill="none" style="stroke-dasharray: 400; stroke-dashoffset: 400; animation: demoDrawChart 1s ease-out forwards;"/>
            ${points.map((p, idx) => `<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="4" fill="var(--text-primary)" stroke="var(--cyan)"/>`).join("")}
          `;
        };

        // Trigger once initially
        btn.click();
      }
    },

    // --------------------------------------------------------------------------
    // AUTOMATION ECOSYSTEM DEMOS
    // --------------------------------------------------------------------------
    "auto-email": {
      render: () => `
        <div class="demo-stage-wrapper">
          <button class="btn btn-purple btn-sm" id="demo-email-btn" style="background:var(--purple);">Kích hoạt Luồng Email</button>
          <div class="demo-output-terminal" id="demo-email-output" style="margin-top:10px; font-size:0.75rem;">
            [Ready] Hệ thống email rảnh rỗi. Nhấn để kích hoạt luồng tự động...
          </div>
        </div>
      `,
      bind: () => {
        const btn = document.getElementById("demo-email-btn");
        const output = document.getElementById("demo-email-output");

        btn.onclick = () => {
          btn.disabled = true;
          output.innerHTML = ``;
          
          const logs = [
            "[0.0s] Nhận sự kiện: Lead mới đăng ký...",
            "[0.8s] AI: Đang soạn thảo email chào mừng cá nhân hóa...",
            "[1.5s] Mail Server: Đang mã hóa và gửi đi qua cổng AeroMail...",
            "[2.2s] CRM: Đã cập nhật trạng thái liên hệ: SENT_WELCOME_EMAIL.",
            "[3.0s] Hoàn tất luồng tự động trong 3 giây."
          ];

          let idx = 0;
          function showNextLog() {
            if (idx < logs.length) {
              const div = document.createElement("div");
              div.style.marginBottom = "4px";
              if (idx === logs.length - 1) div.style.color = "var(--green)";
              div.innerText = logs[idx];
              output.appendChild(div);
              output.scrollTop = output.scrollHeight;
              idx++;
              setTimeout(showNextLog, 600);
            } else {
              btn.disabled = false;
            }
          }
          showNextLog();
        };
      }
    },

    "auto-social": {
      render: () => `
        <div class="demo-stage-wrapper">
          <label class="form-label" style="font-size:0.8rem;">Mạng xã hội:</label>
          <select class="form-control" id="demo-social-select" style="padding: 6px 12px; font-size:0.85rem;">
            <option value="Facebook">Facebook Fanpage</option>
            <option value="Instagram">Instagram Business</option>
            <option value="LinkedIn">LinkedIn Company</option>
          </select>
          <button class="btn btn-purple btn-sm" id="demo-social-btn" style="margin-top:8px; background:var(--purple);">Lên lịch bài đăng</button>
          <div class="demo-output-terminal" id="demo-social-output" style="margin-top:10px; display:none; font-size:0.75rem;"></div>
        </div>
      `,
      bind: () => {
        const btn = document.getElementById("demo-social-btn");
        const sel = document.getElementById("demo-social-select");
        const output = document.getElementById("demo-social-output");

        btn.onclick = () => {
          output.style.display = "block";
          output.innerHTML = `Đang kết nối API ${sel.value}...`;
          
          setTimeout(() => {
            const randomTime = new Date(Date.now() + 86400000).toLocaleString();
            output.innerHTML = `
              <span style="color:var(--green);">[THÀNH CÔNG] Lên lịch bài đăng thành công!</span><br>
              Nền tảng: <strong>${sel.value}</strong><br>
              Thời gian đăng dự kiến: <strong>${randomTime}</strong><br>
              Trạng thái hàng chờ: WAITING_SCHEDULER
            `;
          }, 700);
        };
      }
    },

    "auto-report": {
      render: () => `
        <div class="demo-stage-wrapper">
          <button class="btn btn-purple btn-sm" id="demo-rep-btn" style="background:var(--purple);">Tạo báo cáo tự động</button>
          <div class="demo-output-terminal" id="demo-rep-output" style="margin-top:10px; display:none; font-size:0.75rem;"></div>
        </div>
      `,
      bind: () => {
        const btn = document.getElementById("demo-rep-btn");
        const output = document.getElementById("demo-rep-output");

        btn.onclick = () => {
          btn.disabled = true;
          output.style.display = "block";
          output.innerHTML = `Đang tập hợp dữ liệu kinh doanh từ database...`;
          
          setTimeout(() => {
            output.innerHTML = `Đang cấu trúc hóa bảng Excel & vẽ biểu đồ...`;
            setTimeout(() => {
              output.innerHTML = `
                <span style="color:var(--green);">[XUẤT BÁO CÁO THÀNH CÔNG]</span><br>
                Tên file: <code>business_report_2026.csv</code><br>
                Số lượng giao dịch quét: 1,842 dòng<br>
                <a href="#/store" style="color:var(--cyan); text-decoration:underline; font-weight:600; display:block; margin-top:8px;">📥 Click để tải báo cáo mẫu (Demo)</a>
              `;
              btn.disabled = false;
            }, 800);
          }, 600);
        };
      }
    },

    // --------------------------------------------------------------------------
    // MARKETING NETWORK DEMOS
    // --------------------------------------------------------------------------
    "mkt-lead": {
      render: () => `
        <div class="demo-stage-wrapper">
          <label class="form-label" style="font-size:0.8rem;">Nhập Email thu thập Lead:</label>
          <div style="display:flex; gap:8px;">
            <input type="email" class="form-control" id="demo-mkt-input" placeholder="mail@example.com" style="padding: 6px 12px; font-size:0.85rem;">
            <button class="btn btn-pink btn-sm" id="demo-mkt-btn" style="background:var(--pink);">Đăng ký</button>
          </div>
          <div class="demo-output-terminal" id="demo-mkt-output" style="margin-top:10px; display:none; font-size:0.75rem;"></div>
        </div>
      `,
      bind: () => {
        const btn = document.getElementById("demo-mkt-btn");
        const input = document.getElementById("demo-mkt-input");
        const output = document.getElementById("demo-mkt-output");

        btn.onclick = () => {
          const val = input.value.trim();
          if (val === "" || !val.includes("@")) {
            output.style.display = "block";
            output.innerHTML = `<span style="color:var(--pink);">Vui lòng nhập Email hợp lệ.</span>`;
            return;
          }
          
          output.style.display = "block";
          output.innerHTML = `Đang đăng ký Lead và chấm điểm hành vi...`;
          
          setTimeout(() => {
            output.innerHTML = `
              <span style="color:var(--green);">[LEAD CAPTURED] Đồng bộ CRM thành công!</span><br>
              Email: <strong>${val}</strong><br>
              Lead Score: <strong style="color:var(--cyan);">85/100 (Hot Lead)</strong><br>
              Action: Kích hoạt chuỗi email gửi báo cáo tự động.
            `;
          }, 800);
        };
      }
    },

    "mkt-ads": {
      render: () => `
        <div class="demo-stage-wrapper" style="text-align:center;">
          <h5 style="font-size:0.85rem; color:var(--text-muted);">Hiệu suất chiến dịch Ads (CPC)</h5>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
            <div style="background:var(--bg-deep); padding:8px; border-radius:6px; border:1px solid var(--border-soft);">
              <div style="font-size:0.7rem; color:var(--text-muted);">Tỷ lệ click CTR</div>
              <div style="font-size:1.2rem; font-weight:700; color:var(--pink); margin-top:4px;" id="demo-ads-ctr">8.42%</div>
            </div>
            <div style="background:var(--bg-deep); padding:8px; border-radius:6px; border:1px solid var(--border-soft);">
              <div style="font-size:0.7rem; color:var(--text-muted);">Tỷ lệ chuyển đổi</div>
              <div style="font-size:1.2rem; font-weight:700; color:var(--cyan); margin-top:4px;" id="demo-ads-conv">4.18%</div>
            </div>
          </div>
          <button class="btn btn-pink btn-sm" id="demo-ads-btn" style="margin-top:10px; width:100%; background:var(--pink);">Cập nhật chỉ số</button>
        </div>
      `,
      bind: () => {
        const btn = document.getElementById("demo-ads-btn");
        const ctr = document.getElementById("demo-ads-ctr");
        const conv = document.getElementById("demo-ads-conv");

        btn.onclick = () => {
          ctr.innerText = (5 + Math.random() * 8).toFixed(2) + "%";
          conv.innerText = (2 + Math.random() * 4).toFixed(2) + "%";
        };
      }
    },

    // --------------------------------------------------------------------------
    // DATA SYSTEM DEMOS
    // --------------------------------------------------------------------------
    "data-scrape": {
      render: () => `
        <div class="demo-stage-wrapper">
          <label class="form-label" style="font-size:0.8rem;">Nhập URL trang thương mại điện tử:</label>
          <div style="display:flex; gap:8px;">
            <input type="text" class="form-control" id="demo-scrape-input" placeholder="https://shopee.vn/mock-shop" style="padding: 6px 12px; font-size:0.85rem;">
            <button class="btn btn-green btn-sm" id="demo-scrape-btn" style="background:var(--green); color:var(--bg-deep);">Cào dữ liệu</button>
          </div>
          <div class="demo-output-terminal" id="demo-scrape-output" style="margin-top:10px; display:none; font-size:0.75rem;"></div>
        </div>
      `,
      bind: () => {
        const btn = document.getElementById("demo-scrape-btn");
        const input = document.getElementById("demo-scrape-input");
        const output = document.getElementById("demo-scrape-output");

        btn.onclick = () => {
          const val = input.value.trim() || "https://shopee.vn/mock-shop";
          output.style.display = "block";
          output.innerHTML = `Bắt đầu bypass Cloudflare cho trang: ${val}...`;
          
          setTimeout(() => {
            output.innerHTML = `Đang kết nối proxy xoay vòng và trích xuất DOM...`;
            setTimeout(() => {
              output.innerHTML = `
                <span style="color:var(--green);">[THÀNH CÔNG] Đã cào 3 sản phẩm:</span><br>
                - Nike Air Max ($120) - Hàng tồn: 45 chiếc<br>
                - Adidas Ultraboost ($150) - Hàng tồn: 12 chiếc<br>
                - Puma Runner ($90) - Hàng tồn: 80 chiếc<br>
                <span style="color:var(--text-muted); font-size:0.7rem;">Dữ liệu đã sẵn sàng để chuyển về Data Cleaner.</span>
              `;
            }, 800);
          }, 600);
        };
      }
    },

    "data-clean": {
      render: () => `
        <div class="demo-stage-wrapper">
          <div class="demo-output-terminal" id="demo-clean-output" style="font-size:0.75rem; height:120px;">
            [DỮ LIỆU THÔ CHƯA XỬ LÝ]<br>
            - Dòng 1: ID: 101, Tên: "A", Email: "a@mail.com"<br>
            - Dòng 2: ID: 101, Tên: "A", Email: "a@mail.com" (Trùng)<br>
            - Dòng 3: ID: 102, Tên: null, Email: "b@mail.com" (Lỗi)<br>
            - Dòng 4: ID: 103, Tên: "C", Email: "c@mail.com"
          </div>
          <button class="btn btn-green btn-sm" id="demo-clean-btn" style="margin-top:8px; width:100%; background:var(--green); color:var(--bg-deep);">Chạy lọc và làm sạch dữ liệu</button>
        </div>
      `,
      bind: () => {
        const btn = document.getElementById("demo-clean-btn");
        const output = document.getElementById("demo-clean-output");

        btn.onclick = () => {
          btn.disabled = true;
          output.innerHTML = `Đang rà soát trùng lặp khóa chính (ID)...`;
          
          setTimeout(() => {
            output.innerHTML = `Đang điền giá trị khuyết thiếu (NULL/Empty)...`;
            setTimeout(() => {
              output.innerHTML = `
                <span style="color:var(--green);">[HOÀN TẤT LÀM SẠCH] Chỉ số báo cáo:</span><br>
                - Số dòng rác đã lọc: <strong>1 dòng trùng lặp</strong><br>
                - Số giá trị lỗi đã sửa: <strong>1 dòng sửa null thành "No Name"</strong><br>
                - Tổng dữ liệu sạch: <strong>3 dòng đã xuất dạng CSV</strong>
              `;
              btn.disabled = false;
            }, 800);
          }, 600);
        };
      }
    },

    // --------------------------------------------------------------------------
    // DEVELOPER LAB DEMOS
    // --------------------------------------------------------------------------
    "dev-api": {
      render: () => `
        <div class="demo-stage-wrapper">
          <label class="form-label" style="font-size:0.8rem;">Phương thức API Request:</label>
          <div style="display:flex; gap:8px;">
            <select class="form-control" id="demo-api-method" style="width:80px; padding: 6px; font-size:0.85rem;">
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
            <input type="text" class="form-control" value="https://api.kdg.tech/v1/firewall" readonly style="font-size:0.8rem; background:rgba(255,255,255,0.01);">
            <button class="btn btn-blue btn-sm" id="demo-api-btn" style="background:var(--blue);">Gửi</button>
          </div>
          <div class="demo-output-terminal" id="demo-api-output" style="margin-top:10px; display:none; font-size:0.75rem;"></div>
        </div>
      `,
      bind: () => {
        const btn = document.getElementById("demo-api-btn");
        const method = document.getElementById("demo-api-method");
        const output = document.getElementById("demo-api-output");

        btn.onclick = () => {
          output.style.display = "block";
          output.innerHTML = `HTTP ${method.value} sending...`;
          
          setTimeout(() => {
            output.innerHTML = `
              <span style="color:var(--green);">HTTP/1.1 200 OK</span><br>
              <span style="color:var(--cyan); font-weight:600;">SecureGuard-Response-Payload:</span><br>
              {<br>
              &nbsp;&nbsp;"status": "success",<br>
              &nbsp;&nbsp;"requestLimit": "100req/min",<br>
              &nbsp;&nbsp;"clientIp": "192.168.1.15",<br>
              &nbsp;&nbsp;"firewallBlocked": false<br>
              }
            `;
          }, 600);
        };
      }
    },

    "dev-test": {
      render: () => `
        <div class="demo-stage-wrapper">
          <button class="btn btn-blue btn-sm" id="demo-test-btn" style="background:var(--blue);">Chạy Unit Test Suite</button>
          <div class="demo-output-terminal" id="demo-test-output" style="margin-top:10px; display:none; font-size:0.75rem;"></div>
        </div>
      `,
      bind: () => {
        const btn = document.getElementById("demo-test-btn");
        const output = document.getElementById("demo-test-output");

        btn.onclick = () => {
          btn.disabled = true;
          output.style.display = "block";
          output.innerHTML = ``;
          
          const logs = [
            "🚀 Khởi chạy Jest Test Runner...",
            "PASS  test/aether-nlp.test.js (4.2s)",
            "PASS  test/crm-sync.test.js (1.8s)",
            "PASS  test/security-headers.test.js (0.5s)",
            "---------------------------------------",
            "Tests:       3 passed, 3 total",
            "Snapshots:   0 total",
            "Time:        6.82s"
          ];

          let idx = 0;
          function runNextLog() {
            if (idx < logs.length) {
              const div = document.createElement("div");
              div.style.marginBottom = "4px";
              if (logs[idx].includes("PASS")) div.style.color = "var(--green)";
              if (logs[idx].includes("failed")) div.style.color = "var(--pink)";
              div.innerText = logs[idx];
              output.appendChild(div);
              output.scrollTop = output.scrollHeight;
              idx++;
              setTimeout(runNextLog, 400);
            } else {
              btn.disabled = false;
            }
          }
          runNextLog();
        };
      }
    },

    "dev-security": {
      render: () => `
        <div class="demo-stage-wrapper">
          <button class="btn btn-blue btn-sm" id="demo-sec-btn" style="background:var(--blue);">Quét lỗi bảo mật</button>
          <div class="demo-output-terminal" id="demo-sec-output" style="margin-top:10px; display:none; font-size:0.75rem;"></div>
        </div>
      `,
      bind: () => {
        const btn = document.getElementById("demo-sec-btn");
        const output = document.getElementById("demo-sec-output");

        btn.onclick = () => {
          btn.disabled = true;
          output.style.display = "block";
          output.innerHTML = `Đang phân tích cấu trúc folder và audit code...`;
          
          setTimeout(() => {
            output.innerHTML = `Đang quét lỗ hổng SQL Injection và XSS...`;
            setTimeout(() => {
              output.innerHTML = `
                <span style="color:var(--green);">[AUDIT HOÀN TẤT] Báo cáo bảo mật:</span><br>
                - Tình trạng: <strong style="color:var(--green);">AN TOÀN (0 Nguy cơ)</strong><br>
                - Rate Limit: Đã cấu hình chặn bruteforce<br>
                - SSL/TLS Check: Đã bật mã hóa HTTPS chuẩn.
              `;
              btn.disabled = false;
            }, 800);
          }, 600);
        };
      }
    },

    // --------------------------------------------------------------------------
    // BUSINESS ECOSYSTEM DEMOS
    // --------------------------------------------------------------------------
    "biz-pm": {
      render: () => `
        <div class="demo-stage-wrapper">
          <div class="kanban-board-demo">
            <div class="kanban-col">
              <div class="kanban-col-title">Cần làm</div>
              <div class="kanban-card" id="kanban-card-1" data-status="todo">Thiết lập AI NLP</div>
            </div>
            <div class="kanban-col">
              <div class="kanban-col-title">Đang chạy</div>
              <div class="kanban-card" id="kanban-card-2" data-status="doing">Kết nối CRM</div>
            </div>
            <div class="kanban-col">
              <div class="kanban-col-title">Hoàn tất</div>
              <!-- Empty initially -->
            </div>
          </div>
          <p style="font-size:0.7rem; color:var(--text-muted); text-align:center; margin-top:6px;">Click vào thẻ công việc để dịch chuyển trạng thái cột.</p>
        </div>
      `,
      bind: () => {
        const cards = document.querySelectorAll(".kanban-card");
        cards.forEach(card => {
          card.onclick = (e) => {
            const status = card.getAttribute("data-status");
            const parent = card.parentElement;
            
            // Move Todo -> Doing -> Done -> Todo loop
            if (status === "todo") {
              card.setAttribute("data-status", "doing");
              // Move to 2nd column
              const cols = document.querySelectorAll(".kanban-col");
              cols[1].appendChild(card);
            } else if (status === "doing") {
              card.setAttribute("data-status", "done");
              // Move to 3rd column
              const cols = document.querySelectorAll(".kanban-col");
              cols[2].appendChild(card);
            } else {
              card.setAttribute("data-status", "todo");
              // Move to 1st column
              const cols = document.querySelectorAll(".kanban-col");
              cols[0].appendChild(card);
            }
          };
        });
      }
    }
  };

  // Expose to global namespace
  window.UniverseDemos = {
    renderDemo: (type) => {
      if (demos[type]) return demos[type].render();
      return `<div style="font-size:0.85rem; color:var(--text-muted);">Trạm không gian này không yêu cầu chạy demo.</div>`;
    },
    bindDemo: (type) => {
      if (demos[type] && typeof demos[type].bind === "function") {
        demos[type].bind();
      }
    }
  };
})();
