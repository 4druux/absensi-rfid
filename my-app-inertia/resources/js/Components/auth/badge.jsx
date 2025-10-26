export default function Badge({ imageSrc, altText }) {
    return (
        <>
            <h1 className="z-10 absolute top-5 left-10 text-xl text-indigo-600">
                Smk Yapia Parung LOGO
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-white to-white"></div>

            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: "url('./images/geometric-pattern.svg')",
                    backgroundSize: "cover",
                }}
            ></div>

            <img
                src={imageSrc}
                alt={altText}
                className="max-w-lg w-full z-10 drop-shadow-md"
            />
        </>
    );
}
