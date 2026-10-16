
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import "./style.css";

function App() {
  const [page, setPage] = useState(
    window.location.pathname === "/admin" ? "admin" : "member"
  );
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("server");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  React.useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const snap = await getDoc(doc(db, "users", currentUser.uid));
          setRole(snap.exists() ? snap.data().role || "server" : "server");
        } catch {
          setRole("server");
        }
      }
    });
  }, []);

  async function register() {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", result.user.uid), {
        email,
        role: "server",
        createdAt: new Date().toISOString(),
      });
      setMessage("Đăng ký thành công! Chào mừng bạn đến với đội giúp lễ.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function login() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Đăng nhập thành công.");
    } catch (error) {
      setMessage("Không đăng nhập được. Hãy kiểm tra email và mật khẩu.");
    }
  }

  async function logout() {
    await signOut(auth);
    setMessage("Bạn đã đăng xuất.");
  }

  return (
    <main className="app">
      <header className="hero">
        <div className="cross">✝</div>
        <p className="eyebrow">GIÁO XỨ THÁI AN</p>
        <h1>ĐỘI GIÚP LỄ</h1>
        <p>Phục vụ bàn thánh bằng lòng yêu mến</p>
      </header>

      <nav className="tabs">
        <button
          className={page === "member" ? "active" : ""}
          onClick={() => {
            setPage("member");
            history.pushState({}, "", "/");
          }}
        >
          Bạn Giúp Lễ
        </button>
        <button
          className={page === "admin" ? "active" : ""}
          onClick={() => {
            setPage("admin");
            history.pushState({}, "", "/admin");
          }}
        >
          Quản Trị
        </button>
      </nav>

      {!user ? (
        <section className="panel">
          <h2>{page === "admin" ? "Đăng nhập quản trị" : "Tài khoản giúp lễ"}</h2>
          <p className="muted">
            Đăng nhập hoặc tạo tài khoản để sử dụng ứng dụng.
          </p>
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="Nhập email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            placeholder="Ít nhất 6 ký tự"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="primary" onClick={login}>Đăng nhập</button>
          {page === "member" && (
            <button className="secondary" onClick={register}>
              Tạo tài khoản giúp lễ
            </button>
          )}
          {page === "admin" && (
            <p className="warning">
              Chỉ tài khoản được cấp quyền mới được quản trị. Không tự cấp
              quyền quản trị bằng cách đăng ký tài khoản.
            </p>
          )}
          {message && <p className="message">{message}</p>}
        </section>
      ) : (
        <section className="panel">
          <h2>Xin chào!</h2>
          <p>{user.email}</p>
          {page === "member" ? (
            <>
              <h3>Lịch giúp lễ</h3>
              <p className="muted">
                Khu vực xem lịch và đăng ký ca giúp lễ sẽ được xây dựng ở bước tiếp theo.
              </p>
              <h3>Vai trò tài khoản</h3>
              <p>{role === "super_admin" ? "Quản trị tối cao" : role === "manager" ? "Quản lý" : "Bạn giúp lễ"}</p>
            </>
          ) : (
            <>
              <h3>Khu vực quản trị</h3>
              <p className="muted">
                Chức năng tạo lịch, điểm danh và quản lý thành viên sẽ được thêm
                sau khi thiết lập bảo mật.
              </p>
              {role !== "manager" && role !== "super_admin" && (
                <p className="warning">
                  Tài khoản này chưa có quyền quản trị.
                </p>
              )}
            </>
          )}
          <button className="secondary" onClick={logout}>Đăng xuất</button>
          {message && <p className="message">{message}</p>}
        </section>
      )}

      <footer>Đội Giúp Lễ · Giáo xứ Thái An</footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
