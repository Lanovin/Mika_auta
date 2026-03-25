"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Vehicle } from "@/src/lib/vehicle-types";

interface HeroSliderProps {
  vehicles: Vehicle[];
}

export function HeroSlider({ vehicles }: HeroSliderProps) {
  const slides = vehicles.slice(0, 6);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [paused, next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className="hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-slider__track">
        {slides.map((car, i) => (
          <Link
            key={car.id}
            href={`/vozy/${car.id}`}
            className="hero-slider__slide"
            style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
            aria-hidden={i !== current}
          >
            <Image
              src={car.imageUrl || "/placeholder-car.jpg"}
              alt={car.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority={i === 0}
            />

            {/* Badge */}
            <span className="hero-slider__badge">Doporučujeme</span>

            {/* Bottom gradient overlay with text */}
            <div className="hero-slider__info">
              <div className="hero-slider__title">{car.title}</div>
              <div className="hero-slider__price">
                {car.price.toLocaleString("cs-CZ")}&nbsp;Kč
              </div>
            </div>
          </Link>
        ))}

        {/* Navigation arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              className="hero-slider__arrow hero-slider__arrow--prev"
              aria-label="Předchozí slide"
              onClick={(e) => { e.preventDefault(); prev(); }}
            >
              <ChevronLeft style={{ width: '20px', height: '20px' }} />
            </button>
            <button
              type="button"
              className="hero-slider__arrow hero-slider__arrow--next"
              aria-label="Následující slide"
              onClick={(e) => { e.preventDefault(); next(); }}
            >
              <ChevronRight style={{ width: '20px', height: '20px' }} />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="hero-slider__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              className={`hero-slider__dot ${i === current ? "hero-slider__dot--active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
