from src.validation import success_response
from src.models.db import get_db, save_attendance


class AttendanceController:

    def create(self, validated):
        nid = save_attendance(
            validated["student_id"],
            validated["class_id"],
            validated["date"],
            validated["status"],
            validated.get("remarks", "")
        )

        conn = get_db()
        row = conn.execute(
            "SELECT * FROM attendance WHERE id=?",
            (nid,)
        ).fetchone()
        conn.close()

        return success_response(dict(row), 201)

    def list(self):
        conn = get_db()
        rows = conn.execute(
            "SELECT * FROM attendance ORDER BY id DESC"
        ).fetchall()
        conn.close()

        return success_response(
            [dict(row) for row in rows],
            200
        )

    def update(self, id, validated):
        conn = get_db()

        conn.execute(
            "UPDATE attendance SET status=?, remarks=? WHERE id=?",
            (
                validated["status"],
                validated.get("remarks", ""),
                id
            )
        )

        conn.commit()

        row = conn.execute(
            "SELECT * FROM attendance WHERE id=?",
            (id,)
        ).fetchone()

        conn.close()

        return success_response(dict(row), 200)

    def delete(self, id):
        conn = get_db()

        conn.execute(
            "DELETE FROM attendance WHERE id=?",
            (id,)
        )

        conn.commit()
        conn.close()

        return success_response({"deleted": id}, 200)
