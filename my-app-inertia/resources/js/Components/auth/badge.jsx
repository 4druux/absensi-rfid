export default function Badge({ imageSrc, altText }) {
    return (
        <>
            <div className="z-10 absolute top-5 left-10">
                <img
                    src="./images/logo-smk.png"
                    alt="logo-smk"
                    className="h-14 w-auto"
                />
            </div>
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
