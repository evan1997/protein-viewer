declare global {
  namespace $3Dmol {
    interface ViewerSpec {
      backgroundColor?: string;
      id?: string;
      width?: number | string;
      height?: number | string;
      antialias?: boolean;
      orthographic?: boolean;
      disableFog?: boolean;
    }

    interface AtomSpec {
      serial?: number;
      atom?: string;
      elem?: string;
      hetflag?: boolean;
      chain?: string;
      resi?: number;
      resn?: string;
      x?: number;
      y?: number;
      z?: number;
      b?: number;
      pdbline?: string;
      clickable?: boolean;
      callback?: Function;
      invert?: boolean;
    }

    interface AtomStyleSpec {
      sphere?: {
        radius?: number;
        color?: string;
      };
      stick?: {
        radius?: number;
        color?: string;
        singleBonds?: boolean;
        noBond?: boolean;
      };
      line?: {
        color?: string;
        linewidth?: number;
      };
      cross?: {
        linewidth?: number;
        colorscheme?: string;
        radius?: number;
      };
      cartoon?: {
        color?: string;
        style?: string;
        arrows?: boolean;
        tubes?: boolean;
        thickness?: number;
        width?: number;
      };
      surface?: {
        opacity?: number;
        colorscheme?: string;
        color?: string;
      };
    }

    interface SurfaceSpec {
      opacity?: number;
      color?: string;
      voldata?: any;
      volscheme?: any;
    }

    interface LabelSpec {
      position?: {
        x: number;
        y: number;
        z: number;
      };
      screen?: boolean;
      fontSize?: number;
      fontColor?: string;
      fontOpacity?: number;
      borderThickness?: number;
      borderColor?: string;
      borderOpacity?: number;
      backgroundColor?: string;
      backgroundOpacity?: number;
      alignment?: string;
      inFront?: boolean;
    }

    interface Atom {
      length: number;
    }

    interface Residue {
      length: number;
    }

    interface Model {
      atoms: Atom;
      residues: Residue;
      selectedAtoms: () => { length: number };
    }

    interface Viewer {
      addModel: (data: string, format: string) => Viewer;
      addModelsAsFrames(data: string, format: string): Viewer;
      addSphere(spec: any): Viewer;
      addBox(spec: any): Viewer;
      addArrow(spec: any): Viewer;
      addCylinder(spec: any): Viewer;
      addLine(spec: any): Viewer;
      addSurface: (type: string, style: any) => Viewer;
      addLabel(text: string, spec: LabelSpec): Viewer;
      removeAllLabels(): Viewer;
      removeAllShapes(): Viewer;
      removeAllModels: () => Viewer;
      removeAllSurfaces(): Viewer;
      removeModel(model: any): Viewer;
      rotate(angle: number, axis: string, animationDuration?: number): Viewer;
      rotateX(angle: number, animationDuration?: number): Viewer;
      rotateY(angle: number, animationDuration?: number): Viewer;
      rotateZ(angle: number, animationDuration?: number): Viewer;
      translate(x: number, y: number, animationDuration?: number): Viewer;
      translateScene(x: number, y: number, animationDuration?: number): Viewer;
      zoom: (factor: number) => Viewer;
      zoomTo: () => Viewer;
      setStyle: (selection: any, style: any) => Viewer;
      setBackgroundColor: (color: string) => Viewer;
      setViewStyle: (style: any) => Viewer;
      setProjection(orthographic: boolean): Viewer;
      render: () => Viewer;
      clear: () => Viewer;
      resize(): Viewer;
      spin(axis: string, rate?: number): Viewer;
      setSlab(near: number, far: number): Viewer;
      center(sel?: AtomSpec, animationDuration?: number): Viewer;
      getModel: (modelId?: number) => Model;
      getView(): any[];
      setView(arg: any[]): Viewer;
      enableFog(val: boolean): Viewer;
    }

    interface ViewerContainer {
      createViewer: (element: HTMLElement, options?: any) => Viewer;
      create: (element: HTMLElement, options?: any) => Viewer;
      download: (viewer: Viewer, options?: any) => void;
      ColorScheme: {
        Spectrum: string;
        Chain: string;
        Residue: string;
        Secondary: string;
        Element: string;
      };
    }
  }

  var $3Dmol: $3Dmol.ViewerContainer;
}

export {}; 