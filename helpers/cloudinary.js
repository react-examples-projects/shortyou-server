const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

function uploadVideo(videoBuffer) {
  return new Promise((resolve, reject) => {
    const streamUpload = cloudinary.uploader.upload_stream(
      { folder: "hackatoon_cloudinary/videos", resource_type: "video" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    streamifier.createReadStream(videoBuffer).pipe(streamUpload);
  });
}

async function uploadThumbail(thumbailBuffer) {
  return new Promise((resolve, reject) => {
    const streamUpload = cloudinary.uploader.upload_stream(
      {
        folder: "hackatoon_cloudinary/thumbails",
        quality: 1,
        resource_type: "image",
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    streamifier.createReadStream(thumbailBuffer).pipe(streamUpload);
  });
}

async function uploadOriginal(originalBuffer) {
  return new Promise((resolve, reject) => {
    const streamUpload = cloudinary.uploader.upload_stream(
      { folder: "hackatoon_cloudinary/originals", resource_type: "image" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    streamifier.createReadStream(originalBuffer).pipe(streamUpload);
  });
}

async function uploadPreviewPicture(previewBuffer) {
  const [p1, p2] = await Promise.allSettled([
    uploadThumbail(previewBuffer),
    uploadOriginal(previewBuffer),
  ]);
  return { thumbail: p1.value, original: p2.value };
}

async function uploadPostToCloudinary(videoBuffer, previewPictureBuffer) {
  const [video, previewPictures] = await Promise.allSettled([
    uploadVideo(videoBuffer),
    uploadPreviewPicture(previewPictureBuffer),
  ]);
  const { thumbail, original } = previewPictures.value;

  const data = {
    video: video.value,
    thumbail: thumbail,
    original: original,
  };

  return data;
}

module.exports = {
  uploadVideo,
  uploadOriginal,
  uploadThumbail,
  uploadPreviewPicture,
  uploadPostToCloudinary,
};
