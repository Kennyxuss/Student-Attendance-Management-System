from src.validation import success_response
from src.models.db import get_db, save_subject

def create_subject_controller(validated):
    nid=save_subject(validated["subject_code"], validated["subject_name"], validated.get("description",""), validated["schedule"], validated.get("instructor_id"))
    conn=get_db(); row=conn.execute("SELECT * FROM subjects WHERE id=?",(nid,)).fetchone(); conn.close()
    return success_response(dict(row),201)

def list_subjects_controller():
    conn=get_db(); rows=conn.execute("SELECT * FROM subjects ORDER BY id DESC").fetchall(); conn.close()
    return success_response([dict(r) for r in rows],200)

def update_subject_controller(id, validated):
    conn=get_db()
    conn.execute("UPDATE subjects SET subject_code=?,subject_name=?,description=?,schedule=?,instructor_id=? WHERE id=?",(validated["subject_code"],validated["subject_name"],validated.get("description",""),validated["schedule"],validated.get("instructor_id"),id))
    conn.commit(); row=conn.execute("SELECT * FROM subjects WHERE id=?",(id,)).fetchone(); conn.close()
    return success_response(dict(row),200)

def delete_subject_controller(id):
    conn=get_db(); conn.execute("DELETE FROM subjects WHERE id=?",(id,)); conn.commit(); conn.close()
    return success_response({"deleted":id},200)
