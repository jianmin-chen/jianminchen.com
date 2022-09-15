import bcrypt from "bcrypt";
import Admin from "../models/admin.model";

class AdminService {
    async create(data) {
        return await Admin.create(data);
    }

    async validate(username, password) {
        const admin = await Admin.findOne({ username });
        if (!admin) return false;
        if (!(await bcrypt.compare(password, admin.password))) return false;
        return true;
    }
}

export default new AdminService();
