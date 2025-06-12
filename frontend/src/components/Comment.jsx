import React, { useState, useEffect } from "react";
import { getCommentsByTinyHouseId } from "../services/CommentService";
import { addStars } from "../utils/countingStars";
export default function Comment({ tinyHouseId }) {
  const [comments, setComments] = useState([]);

  const fetchTinyHouseComments = async () => {
    try {
      const data = await getCommentsByTinyHouseId(tinyHouseId);
      // tinyHouse.id ile eşleşenleri filtrele

      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTinyHouseComments();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h5 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Yorumlar</h5>
      <div className="comments-grid">
        {comments.map((c) => (
          <div key={c.id} className="comment-card">
            <p>
              <strong>{addStars(c.rating)}</strong>
            </p>
            <p>
              <strong>{c.fullName}</strong>
            </p>
            <p>
              <strong>{c.comment}</strong>
            </p>
            <p>
              <strong>{c.review_date}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
