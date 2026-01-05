import heroImage from '../assets/hero_v2.jpg';

export default function HeroSection() {
    return (
        <section className="relative h-[300px] md:h-[450px] overflow-hidden rounded-3xl mb-12 premium-shadow mx-4 md:mx-0">
            {/* Background with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${heroImage})`,
                }}
            >
                {/* Darker gradient on the left for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 via-purple-900/20 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative h-full container mx-auto px-8 md:px-16 flex flex-col justify-center items-start">
                <div className="max-w-lg animate-fade-in-up">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-widest uppercase rounded-full mb-4 border border-white/30">
                        Nueva Colección 2026
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-md">
                        Resalta tu <br />
                        <span className="text-purple-100 italic">belleza única</span>
                    </h2>
                    <p className="text-white/90 text-lg md:text-xl mb-8 font-medium drop-shadow">
                        Descubre los mejores productos de maquillaje y skincare elegidos especialmente para ti.
                    </p>
                    <button className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-3.5 rounded-full font-bold transition-all duration-300 shadow-xl hover:shadow-purple-200 hover:-translate-y-1 border border-purple-100">
                        Ver Ofertas
                    </button>
                </div>
            </div>

            {/* Decorative element */}
            <div className="absolute bottom-4 right-8 text-white/50 text-xs font-medium hidden md:block">
                Trendy & Skin Care Experts
            </div>
        </section>
    );
}
