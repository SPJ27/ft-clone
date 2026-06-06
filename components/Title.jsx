const Title = ({ text }) => {
  return (
    <div>
    <div
      style={{
        backgroundImage: `url("https://flavortown.hackclub.com/assets/mask/title-54f351a5.webp")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: 'Jua, sans-serif',
        minHeight: '50px',
      }}
      className="tracking-wide bg-[#3d5e8a] justify-center items-center flex text-center w-md mx-auto text-white text-2xl font-bold px-12 py-2.5 rounded-2xl mt-10"
    >
      {text}
    </div>
    </div>
  )
}

export default Title;