import React, { useState, useEffect } from "react";
import "../css/Contact.css";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { sendEmail } from "../redux/slices/emailSlice";

function Contact() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const emailStatus = useSelector((state) => state.email.status);
  const emailError = useSelector((state) => state.email.error);
  const emailSuccess = useSelector((state) => state.email.success);

  const handleSubmit = () => {
    if (!title || !content) {
      setError("Mail başlığı ve içeriği gerekli!");
      return;
    }

    setError("");

    dispatch(sendEmail({ title, content }));
    console.log("Mail Başlığı:", title);
    console.log("Mail İçeriği:", content);
  };

  // E-posta gönderimi sonrası gelen durum mesajlarını göster
  useEffect(() => {
    if (emailStatus === "succeeded") {
      alert(emailSuccess);
    } else if (emailStatus === "failed") {
      alert(emailError);
    }
  }, [emailStatus, emailError, emailSuccess]);

  return (
    <div className="mail-container">
      <div className="mail-form">
        <div className="form-title">BİZİMLE İLETİŞİME GEÇ!</div>
        <input
          type="text"
          id="mail-title"
          placeholder="Lütfen mail başlığını giriniz.."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="mail-content"
          placeholder="Bir şeyler yaz.."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Hata mesajı */}
        <div>
          <Button
            variant="contained"
            sx={{ backgroundColor: "darkblue", color: "white" }}
            onClick={handleSubmit}
          >
            Gönder
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
