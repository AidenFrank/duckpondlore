export default function AboutContent() {
    return (
        <>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 py-2 whitespace-nowrap w-full">
                <div className="flex items-center justify-center">
                    <img className="w-30 h-30" src="/images/The_Duckpond.png" alt="The Duckpond logo"></img>
                </div>
                <div className="flex items-center justify-center">
                    <h1 className="text-2xl md:text-4xl font-extrabold">Welcome to The Duckpond!</h1>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <div className="text-center gap-2 w-fit">
                    <p>The Duckpond is a place where ducks come to quack, play games, and chill.</p>
                    <p>Feel free to poke around the site and maybe even join the Discord.</p>
                    <p>Please enjoy your stay!</p>
                </div>
            </div>
        </>
    );
}
