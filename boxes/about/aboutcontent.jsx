export default function AboutContent() {
  return (
    <>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 py-2 whitespace-nowrap w-full">
            <div className="flex items-center justify-center">
                <img className="w-30 h-30" src="/images/The_Duckpond.png" alt='The Duckpond logo'></img>
            </div>
            <div className="flex items-center justify-center">
                <h1 className="text-2xl md:text-4xl font-extrabold">Welcome to The Duckpond!</h1>
            </div>
        </div>
        <div className=" text-justify gap-2 w-fit">
            <div>
                <p>The Duckpond, founded in 2018, is a super awesome Discord server where people play games and talk.</p>
                <p>The Discord server also has a ton of lore, so this website was made to keep track of it.</p>
                <p>Please enjoy your stay!</p>
            </div>
        </div>
    </>
  );
}