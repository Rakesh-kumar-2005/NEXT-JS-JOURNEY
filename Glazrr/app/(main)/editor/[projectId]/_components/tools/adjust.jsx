"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useCanvas } from "@/context/context";
import { filters } from "fabric";
import { Rotate3DIcon } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { PuffLoader } from "react-spinners";

// Filter configurations
const FILTER_CONFIGS = [
  {
    key: "brightness",
    label: "Brightness",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Brightness,
    valueKey: "brightness",
    transform: (value) => value / 100,
  },
  {
    key: "contrast",
    label: "Contrast",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Contrast,
    valueKey: "contrast",
    transform: (value) => value / 100,
  },
  {
    key: "saturation",
    label: "Saturation",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Saturation,
    valueKey: "saturation",
    transform: (value) => value / 100,
  },
  {
    key: "vibrance",
    label: "Vibrance",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Vibrance,
    valueKey: "vibrance",
    transform: (value) => value / 100,
  },
  {
    key: "blur",
    label: "Blur",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0,
    filterClass: filters.Blur,
    valueKey: "blur",
    transform: (value) => value / 100,
  },
  {
    key: "hue",
    label: "Hue",
    min: -180,
    max: 180,
    step: 1,
    defaultValue: 0,
    filterClass: filters.HueRotation,
    valueKey: "rotation",
    transform: (value) => value * (Math.PI / 180),
    suffix: "°",
  },
];

// Default values...
const DEFAULT_VALUES = FILTER_CONFIGS.reduce((acc, config) => {
  acc[config.key] = config.defaultValue;
  return acc;
}, {});

const AdjustControls = () => {
  // State for filter values
  const [filterValues, setFilterValues] = useState(DEFAULT_VALUES);
  const [isApplying, setIsApplying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Canvas editor
  const { canvasEditor } = useCanvas();

  // Get active image
  const getActiveImage = useCallback(() => {
    if (!canvasEditor) return null;
    const activeObject = canvasEditor.getActiveObject();
    if (activeObject && activeObject.type === "image") return activeObject;

    const objects = canvasEditor.getObjects();
    return objects.find((obj) => obj.type === "image") || null;
  }, [canvasEditor]);

  // Extract filter values from image object
  const extractFilterValues = useCallback((imageObject) => {
    if (!imageObject?.filters?.length) return DEFAULT_VALUES;

    const extractedValues = { ...DEFAULT_VALUES };

    imageObject.filters.forEach((filter) => {
      const config = FILTER_CONFIGS.find(
        (c) => c.filterClass.name === filter.constructor.name
      );
      if (config) {
        const filterValue = filter[config.valueKey];
        if (config.key === "hue") {
          extractedValues[config.key] = Math.round(
            filterValue * (180 / Math.PI)
          );
        } else {
          extractedValues[config.key] = Math.round(filterValue * 100);
        }
      }
    });

    return extractedValues;
  }, []);

  // Apply filters to image
  const applyFilters = useCallback(async (newValues, skipStateUpdate = false) => {
    const imageObject = getActiveImage();
    if (!imageObject || isApplying) return;

    setIsApplying(true);

    try {
      const filtersToApply = [];

      FILTER_CONFIGS.forEach((config) => {
        const value = newValues[config.key];
        if (value !== config.defaultValue) {
          const transformedValue = config.transform(value);
          filtersToApply.push(
            new config.filterClass({
              [config.valueKey]: transformedValue,
            })
          );
        }
      });

      imageObject.filters = filtersToApply;

      await new Promise((resolve) => {
        imageObject.applyFilters();
        canvasEditor.requestRenderAll();
        setTimeout(resolve, 50);
      });

      // Save filter values to canvas state for persistence
      if (!skipStateUpdate && canvasEditor) {
        const canvasState = canvasEditor.toJSON();
        canvasState.filterValues = newValues;
        
        // Store in sessionStorage for immediate persistence
        sessionStorage.setItem('canvasFilterValues', JSON.stringify(newValues));
      }

    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsApplying(false);
    }
  }, [getActiveImage, isApplying, canvasEditor]);

  // Handle value change in slider
  const handleValueChange = useCallback((filterKey, value) => {
    const newValues = {
      ...filterValues,
      [filterKey]: Array.isArray(value) ? value[0] : value,
    };
    setFilterValues(newValues);
    applyFilters(newValues);
  }, [filterValues, applyFilters]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilterValues(DEFAULT_VALUES);
    applyFilters(DEFAULT_VALUES);
    // Clear stored filter values
    sessionStorage.removeItem('canvasFilterValues');
  }, [applyFilters]);

  // Initialize filter values on component mount
  useEffect(() => {
    if (!canvasEditor || isInitialized) return;

    const initializeFilters = () => {
      const imageObject = getActiveImage();
      
      if (imageObject) {
        // Try to restore from sessionStorage first
        const storedFilters = sessionStorage.getItem('canvasFilterValues');
        
        if (storedFilters) {
          try {
            const parsedFilters = JSON.parse(storedFilters);
            setFilterValues(parsedFilters);
            // Apply the stored filters to the image
            applyFilters(parsedFilters, true);
            setIsInitialized(true);
            return;
          } catch (error) {
            console.error('Error parsing stored filters:', error);
          }
        }

        // Fallback to extracting from image filters
        if (imageObject.filters && imageObject.filters.length > 0) {
          const existingValues = extractFilterValues(imageObject);
          setFilterValues(existingValues);
          setIsInitialized(true);
        } else {
          // No existing filters, use defaults
          setFilterValues(DEFAULT_VALUES);
          setIsInitialized(true);
        }
      }
    };

    // Small delay to ensure canvas is fully loaded
    const timeout = setTimeout(initializeFilters, 100);
    return () => clearTimeout(timeout);
  }, [canvasEditor, getActiveImage, extractFilterValues, applyFilters, isInitialized]);

  // Listen for canvas object selection changes
  useEffect(() => {
    if (!canvasEditor || !isInitialized) return;

    const handleSelectionChange = () => {
      const imageObject = getActiveImage();
      if (imageObject && imageObject.filters) {
        const existingValues = extractFilterValues(imageObject);
        setFilterValues(existingValues);
      }
    };

    canvasEditor.on('selection:created', handleSelectionChange);
    canvasEditor.on('selection:updated', handleSelectionChange);

    return () => {
      canvasEditor.off('selection:created', handleSelectionChange);
      canvasEditor.off('selection:updated', handleSelectionChange);
    };
  }, [canvasEditor, getActiveImage, extractFilterValues, isInitialized]);

  if (!canvasEditor) {
    return (
      <div className="p-4">
        <p className="text-white/70 text-sm">
          Load an image to start adjusting
        </p>
      </div>
    );
  }

  const activeImage = getActiveImage();
  if (!activeImage) {
    return (
      <div className="p-4">
        <p className="text-white/70 text-sm">
          Select an Image to start adjusting
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Heading and Reset Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-white font-medium">Image Adjustments</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-white/70 hover:text-white rounded-4xl"
        >
          <Rotate3DIcon className="h-4 w-4 animate- text-white" />
          Reset
        </Button>
      </div>

      {/* Filter Sliders */}
      {FILTER_CONFIGS.map((config) => (
        <div key={config.key} className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-white">{config.label}</label>
            <span className="text-sm text-white/70">
              {filterValues[config.key]}
              {config.suffix || ""}
            </span>
          </div>

          <Slider
            value={[filterValues[config.key]]}
            onValueChange={(value) => handleValueChange(config.key, value)}
            max={config.max}
            min={config.min}
            step={config.step}
            className="w-full"
          />
        </div>
      ))}

      {/* Info */}
      <div className="mt-4 p-3 bg-slate-700 rounded-lg">
        <p className="text-xs text-white/70">
          Adjustments are applied in real-time. <br /> Use the reset button to
          restore the original values.
        </p>
      </div>

      {/* Loading Indicator */}
      {isApplying && (
        <div className="flex gap-4 items-center justify-center">
          <PuffLoader size={22} color="#00bbff" />
          <p className="text-sm text-white/70">Applying Filters</p>
        </div>
      )}
    </div>
  );
};

export default AdjustControls;