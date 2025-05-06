const Loader = () => (
    <div className="flex items-start justify-center w-[80%] mx-auto px-4 py-6 ">
        <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-black"
            role="status"
        >
          <span
              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
    </div>
)

export default Loader;