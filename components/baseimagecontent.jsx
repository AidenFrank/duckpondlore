export default function BaseImageContent({ src, alt }) {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <img src={src} alt={alt} className="max-w-full max-h-full object-contain" />
        </div>
    );
}
