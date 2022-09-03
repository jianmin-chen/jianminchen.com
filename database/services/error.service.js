import Error from "../models/error.model";

class ErrorService {
    async logError(data) {
        return await Error.create(data);
    }
}

export default new ErrorService();
