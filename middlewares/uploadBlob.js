const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = function () {
    return async function (req, res, next) {

        //確認檔案格式
        if (!req.file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            res.status(415).json({ message: `請上傳照片副檔名為jpg,jpeg,png的照片` })
        }

        try {
            const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

            if (!AZURE_STORAGE_CONNECTION_STRING) throw Error('Azure Storage Connection string not found');

            // 與azure blobstorage連線
            const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

            // 取得特定Container
            const containerClient = blobServiceClient.getContainerClient("newcontainer");

            const blobName = req.body.name
            const blobType = req.file.originalname.match(/\.(jpg|jpeg|png)$/)[1]

            // 設定檔案名稱及設定檔案格式
            const blockBlobClient = containerClient.getBlockBlobClient(`${blobName}.${blobType}`);
            const blobOptions = { blobHTTPHeaders: { blobContentType: `image/${blobType}` } };

            // 顯示blobname及bloburl
            console.log(
                `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
            );

            // Upload data to the storage
            const uploadBlobResponse = await blockBlobClient.upload(req.file.buffer, req.file.buffer.length, blobOptions);
            console.log(`Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`);

            //Assign url to response
            res.product = {}
            res.product.image = blockBlobClient.url

            next()
        } catch (err) {
            //上傳失敗
            res.status(400).json({ message: `Upload blob failed,${err}` })
        }
    };
}