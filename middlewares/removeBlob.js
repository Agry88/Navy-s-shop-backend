const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = function () {
    return async function (req, res, next) {
        try {
            const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

            if (!AZURE_STORAGE_CONNECTION_STRING) throw Error('Azure Storage Connection string not found');

            // 與azure blobstorage連線
            const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

            // 取得特定Container
            const containerClient = blobServiceClient.getContainerClient("newcontainer");

            const blobURL = res.product.image
            const blobName = blobURL.match(/(\/[\w]*\.[\w]*$)/gm)[1]

            // 設定檔案名稱及設定檔案格式
            const blockBlobClient = containerClient.getBlockBlobClient(`${blobName}`);

            // 設定是否刪除快照
            const options = {
                deleteSnapshots: 'include'
            }

            // Upload data to the storage
            const uploadBlobResponse = await blockBlobClient.deleteIfExists(options);
            console.log(uploadBlobResponse);
            console.log(`Blob was delete successfully`);
            next()
        } catch (err) {
            //上傳失敗
            res.status(400).json({ message: `Delete blob failed,${err}` })
        }
    };
}