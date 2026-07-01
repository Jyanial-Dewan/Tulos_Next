import { useRef, type MouseEvent } from 'react';

export default function PerfectMoodboardCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const moodboardImages = [
    {
      id: 1,
      src: "https://plus.unsplash.com/premium_photo-1673758891156-7fc84442fb8e?w=400",
      alt: "Man in gray coat and beanie",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400",
      alt: "Man in brown shirt jacket and cap",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
      alt: "Person sitting in white sweatshirt and trousers",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1723173536164-7294f2fb3f59?w=400",
      alt: "Person sitting in white sweatshirt and trousers",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400",
      alt: "Minimal white sweatshirt flatlay",
    },
    {
      id: 6,
      src: "https://plus.unsplash.com/premium_photo-1673977133185-a460c4744cec?w=400",
      alt: "Minimal white sweatshirt flatlay",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400",
      alt: "Minimal white sweatshirt flatlay",
    },
  ];

  const offset = (i: number) => i % 2 === 0 ? "-translate-y-8" : "translate-y-12";

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    isDown = true;
    carouselRef.current?.classList.add('active');
    startX = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    scrollLeft = carouselRef.current?.scrollLeft ?? 0;
  };

  const handleMouseLeave = () => {
    isDown = false;
    carouselRef.current?.classList.remove('active');
  };

  const handleMouseUp = () => {
    isDown = false;
    carouselRef.current?.classList.remove('active');
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div className="w-full min-h-[600px] flex items-center justify-center p-8 overflow-hidden select-none">
       
      <div 
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex flex-nowrap items-center gap-10 max-w-[1400px] w-full overflow-x-auto py-24 cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: 'none',       // Firefox scrollbar hide
          msOverflowStyle: 'none',     // IE scrollbar hide
        }}
      >
        {/* Crome Browser scrollbar hide */}
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {moodboardImages.map((image, index) => (
          <div
            key={image.id}
            className={`flex-none w-[290px] sm:w-[330px] md:w-[360px] transition-transform duration-300 hover:scale-105 ${offset(index)}`}
          >
            <div className="aspect-[4/5] w-full overflow-hidden bg-gray-50 border border-gray-200/40">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover pointer-events-none" 
              />
            </div>
            <div className="h-14 w-full bg-white"></div>
          </div>
        ))}

      </div>
    </div>
  );
}
