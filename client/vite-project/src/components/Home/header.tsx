const Header = () => {

    return (
        <>
        <div className="h-[80px] w-[100vw] bg-[#318CE7] text-white">
        <div className="flex px-[20px] justify-between pt-[20px]">
        <div className="text-[30px]">
            <h1>Bus ticket booking</h1>
        </div>
        <div className="flex items-center text-[18px]">
            <div className="pr-[15px] cursor-pointer hover:underline">Verify Email</div>
            <div className="cursor-pointer hover:underline">Login</div>
        </div>
        </div>
        </div>
        </>
    )
}

export default Header