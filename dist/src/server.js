"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("../constants");
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const PORT = constants_1.env.PORT;
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
app.use('/', require('./routes/routes'));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map