import { Router } from 'express';
const router = Router();
import { createFormController, getFormController, saveDraftController, submitFormController, uploadFileController } from "../controllers/forms.controller.js";
import { fetchFormUuid } from '../middlewares/fetchFormUuid.js';
import { upload } from '../middlewares/upload.js';




router.post("/", createFormController);
router.get("/:uuid", getFormController);
router.put("/:uuid", saveDraftController);
router.post("/:uuid/submit", submitFormController);
// route to handle file upload
router.post("/:uuid/upload",fetchFormUuid, // db fetch and add path
    upload.fields([     // multer
        {name: 'passportPhoto', maxCount: 1},
        {name: "paymentReceipt", maxCount: 1}
    ]),
    uploadFileController   //controller
)




export default router;