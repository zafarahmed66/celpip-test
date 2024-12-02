import Timer from "./timer";

interface DescribingImageProps {
  title: string;
  preparationTime: number;
  recordingTime: number;
  imageUrl: string;
}

export default function DescribingImage({
    title,
    preparationTime,
    recordingTime,
    imageUrl
} : DescribingImageProps) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-medium text-customLightBlue md:text-base">
        <span className="inline-block w-6 h-6 mr-2 text-center text-white rounded-full bg-customLightBlue">
          i
        </span>
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <img src={imageUrl} alt={title} />
      <Timer preparationTime={preparationTime} recordingTime={recordingTime} />
      </div>
    </div>
  );
}
