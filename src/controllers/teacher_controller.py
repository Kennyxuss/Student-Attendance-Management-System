from src.models.db import get_db
from src.validation import success_response

def create_teacher_controller(validated):
    from src.models.db import save_teacher, get_db
    conn=get_db()
    # thin: delegate to model
    from src.models.db import save_teacher
    nid=save_teacher(validated["employee_id"], validated["name"], validated["department"], validated["email"], validated.get("contact",""))
    row=conn.execute("SELECT * FROM teachers WHERE id=?",(nid,)).fetchone()
    conn.close()
    return success_response(dict(row),201)

def list_teachers_controller():
    from src.models.db import get_db
    conn=get_db(); rows=conn.execute("SELECT * FROM teachers ORDER BY id DESC").fetchall(); conn.close()
    return success_response([dict(r) for r in rows],200)

def update_teacher_controller(id, validated):
    from src.models.db import get_db
    conn=get_db()
    conn.execute("UPDATE teachers SET name=?,department=?,email=?,contact=? WHERE id=?",(validated["name"],validated["department"],validated["email"],validated.get("contact",""),id))
    conn.commit()
    row=conn.execute("SELECT * FROM teachers WHERE id=?",(id,)).fetchone()
    conn.close()
    return success_response(dict(row),200)

def delete_teacher_controller(id):
    from src.models.db import get_db
    conn=get_db(); conn.execute("DELETE FROM teachers WHERE id=?",(id,)); conn.commit(); conn.close()
    return success_response({"deleted":id},200)
