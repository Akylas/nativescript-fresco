import {
  View,
  Property,
  booleanConverter,
  Color
} from "tns-core-modules/ui/core/view";
import * as observableModule from "tns-core-modules/data/observable";
import { isIOS } from "tns-core-modules/platform";

export type Transition = "fade" | "curlUp";

export enum ScaleType {
  Center = "center",
  CenterCrop = "centerCrop",
  CenterInside = "centerInside",
  FitCenter = "fitCenter",
  FitEnd = "fitEnd",
  FitStart = "fitStart",
  FitXY = "fitXY",
  FocusCrop = "focusCrop"
}

export interface AnimatedImage {
  start(): void;
  stop(): void;
  isRunning(): boolean;
}

export interface ImageInfo {
  getHeight(): number;
  getWidth(): number;
}

export interface FrescoError {
  getMessage(): string;
  getErrorType(): string;
  toString(): string;
}

export interface ImagePipelineConfigSetting {
  isDownsampleEnabled?: boolean;
}

export class EventData implements observableModule.EventData {
  private _eventName: string;
  private _object: any;

  get eventName(): string {
    return this._eventName;
  }

  set eventName(value: string) {
    this._eventName = value;
  }

  get object(): any {
    return this._object;
  }

  set object(value: any) {
    this._object = value;
  }
}
export type Stretch = "none" | "fill" | "aspectFill" | "aspectFit";

export class FrescoDraweeBase extends View {
  public static finalImageSetEvent: string = "finalImageSet";
  public static failureEvent: string = "failure";
  public static intermediateImageFailedEvent: string =
    "intermediateImageFailed";
  public static intermediateImageSetEvent: string = "intermediateImageSet";
  public static releaseEvent: string = "release";
  public static submitEvent: string = "submit";

  public imageUri: string;
  public placeholderImageUri: string;
  public failureImageUri: string;
  public actualImageScaleType: ScaleType;
  public fadeDuration: number;
  public backgroundUri: string;
  public progressiveRenderingEnabled: boolean;
  public showProgressBar: boolean;
  public progressBarColor: string;
  public roundAsCircle: boolean;
  public roundBottomRight: boolean;
  public roundTopLeft: boolean;
  public roundTopRight: boolean;
  public roundBottomLeft: boolean;
  public roundedCornerRadius: number;
  public blurRadius: number;
  public blurDownSampling: number;
  public autoPlayAnimations: boolean;
  public tapToRetryEnabled: boolean;
  public aspectRatio: number;
  public decodeWidth: number;
  public decodeHeight: number;

  public readonly isLoading: boolean;

  public static imageUriProperty = new Property<FrescoDraweeBase, string>({
    name: "imageUri",
    defaultValue: undefined,
    valueConverter: v => v,
    valueChanged: (target, oldValue, newValue) => {
      target.onImageUriPropertyChanged(oldValue, newValue);
    }
  });

  public static placeholderImageUriProperty = new Property<
  FrescoDraweeBase,
    string
  >({
    name: "placeholderImageUri",
    defaultValue: undefined,
    valueConverter: v => v,
    valueChanged: (target, oldValue, newValue) => {
      target.onPlaceholderImageUriPropertyChanged(oldValue, newValue);
    }
  });

  public static failureImageUriProperty = new Property<FrescoDraweeBase, string>({
    name: "failureImageUri",
    defaultValue: undefined,
    valueConverter: v => v,
    valueChanged: (target, oldValue, newValue) => {
      target.onFailureImageUriPropertyChanged(oldValue, newValue);
    }
  });

  public static actualImageScaleTypeProperty = new Property<
  FrescoDraweeBase,
    string
  >({
    name: "actualImageScaleType",
    defaultValue: undefined,
    valueConverter: v => v,
    valueChanged: (target, oldValue, newValue) => {
      target.onActualImageScaleTypePropertyChanged(oldValue, newValue);
    }
  });

  public static fadeDurationProperty = new Property<FrescoDraweeBase, number>({
    name: "fadeDuration",
    defaultValue: undefined,
    valueConverter: v => parseFloat(v),
    valueChanged: (target, oldValue, newValue) => {
      target.onFadeDurationPropertyChanged(oldValue, newValue);
    }
  });

  public static backgroundUriProperty = new Property<FrescoDraweeBase, string>({
    name: "backgroundUri",
    defaultValue: undefined,
    valueConverter: v => v,
    valueChanged: (target, oldValue, newValue) => {
      target.onBackgroundUriPropertyChanged(oldValue, newValue);
    }
  });

  public static progressiveRenderingEnabledProperty = new Property<
    FrescoDraweeBase,
    boolean
  >({
    name: "progressiveRenderingEnabled",
    defaultValue: undefined,
    valueConverter: booleanConverter,
    valueChanged: (target, oldValue, newValue) => {
      target.onProgressiveRenderingEnabledPropertyChanged(oldValue, newValue);
    }
  });

  public static showProgressBarProperty = new Property<FrescoDraweeBase, boolean>({
    name: "showProgressBar",
    defaultValue: undefined,
    valueConverter: booleanConverter,
    valueChanged: (target, oldValue, newValue) => {
      target.onShowProgressBarPropertyChanged(oldValue, newValue);
    }
  });

  public static progressBarColorProperty = new Property<FrescoDraweeBase, string>({
    name: "progressBarColor",
    defaultValue: undefined,
    valueConverter: v => v,
    valueChanged: (target, oldValue, newValue) => {
      target.onProgressBarColorPropertyChanged(oldValue, newValue);
    }
  });

  public static roundAsCircleProperty = new Property<FrescoDraweeBase, boolean>({
    name: "roundAsCircle",
    defaultValue: undefined,
    valueConverter: booleanConverter,
    affectsLayout: true,
    valueChanged: (target, oldValue, newValue) => {
      target.onRoundAsCirclePropertyChanged(oldValue, newValue);
    }
  });

  public static roundTopLeftProperty = new Property<FrescoDraweeBase, boolean>({
    name: "roundTopLeft",
    defaultValue: undefined,
    valueConverter: booleanConverter,
    affectsLayout: true,
    valueChanged: (target, oldValue, newValue) => {
      target.onRoundTopLeftPropertyChanged(oldValue, newValue);
    }
  });

  public static roundTopRightProperty = new Property<FrescoDraweeBase, boolean>({
    name: "roundTopRight",
    defaultValue: undefined,
    valueConverter: booleanConverter,
    affectsLayout: true,
    valueChanged: (target, oldValue, newValue) => {
      target.onRoundTopRightPropertyChanged(oldValue, newValue);
    }
  });

  public static roundBottomLeftProperty = new Property<FrescoDraweeBase, boolean>({
    name: "roundBottomLeft",
    defaultValue: undefined,
    valueConverter: booleanConverter,
    valueChanged: (target, oldValue, newValue) => {
      target.onRoundBottomLeftPropertyChanged(oldValue, newValue);
    }
  });

  public static roundBottomRightProperty = new Property<FrescoDraweeBase, boolean>({
    name: "roundBottomRight",
    defaultValue: undefined,
    valueConverter: booleanConverter,
    valueChanged: (target, oldValue, newValue) => {
      target.onRoundBottomRightPropertyChanged(oldValue, newValue);
    }
  });

  public static roundedCornerRadiusProperty = new Property<
    FrescoDraweeBase,
    number
  >({
    name: "roundedCornerRadius",
    defaultValue: undefined,
    valueConverter: v => parseFloat(v),
    valueChanged: (target, oldValue, newValue) => {
      target.onRoundedCornerRadiusPropertyChanged(oldValue, newValue);
    }
  });

  public static blurRadiusProperty = new Property<FrescoDraweeBase, number>({
    name: "blurRadius",
    defaultValue: undefined,
    valueConverter: v => parseFloat(v),
    valueChanged: (target, oldValue, newValue) => {
      target.onBlurRadiusPropertyChanged(oldValue, newValue);
    }
  });

  public static blurDownSamplingProperty = new Property<FrescoDraweeBase, number>({
    name: "blurDownSampling",
    defaultValue: undefined,
    valueConverter: v => parseFloat(v),
    valueChanged: (target, oldValue, newValue) => {
      target.onBlurDownSamplingPropertyChanged(oldValue, newValue);
    }
  });

  public static autoPlayAnimationsProperty = new Property<
    FrescoDraweeBase,
    boolean
  >({
    name: "autoPlayAnimations",
    defaultValue: undefined,
    valueConverter: booleanConverter,
    valueChanged: (target, oldValue, newValue) => {
      target.onAutoPlayAnimationsPropertyChanged(oldValue, newValue);
    }
  });

  public static tapToRetryEnabledProperty = new Property<FrescoDraweeBase, boolean>(
    {
      name: "tapToRetryEnabled",
      defaultValue: undefined,
      valueConverter: booleanConverter,
      valueChanged: (target, oldValue, newValue) => {
        target.onTapToRetryEnabledPropertyChanged(oldValue, newValue);
      }
    }
  );

  public static aspectRatioProperty = new Property<FrescoDraweeBase, number>({
    name: "aspectRatio",
    defaultValue: undefined,
    affectsLayout: isIOS,
    valueConverter: v => parseFloat(v),
    valueChanged: (target, oldValue, newValue) => {
      target.onAspectRatioPropertyChanged(oldValue, newValue);
    }
  });

  public static decodeWidthProperty = new Property<FrescoDraweeBase, number>({
    name: "decodeWidth",
    defaultValue: undefined,
    valueConverter: v => parseFloat(v),
    valueChanged: (target, oldValue, newValue) => {
      target.onDecodeWidthPropertyChanged(oldValue, newValue);
    }
  });

  public static decodeHeightProperty = new Property<FrescoDraweeBase, number>({
    name: "decodeHeight",
    defaultValue: undefined,
    valueConverter: v => parseFloat(v),
    valueChanged: (target, oldValue, newValue) => {
      target.onDecodeHeightPropertyChanged(oldValue, newValue);
    }
  });

  onlyTransitionIfRemote: boolean;
  public static onlyTransitionIfRemoteProperty = new Property<
    FrescoDraweeBase,
    boolean
  >({
    name: "onlyTransitionIfRemote",
    defaultValue: undefined,
    valueConverter: booleanConverter
  });

  tintColor: Color;
  public static tintColorProperty = new Property<FrescoDraweeBase, Color>({
    name: "tintColor",
    defaultValue: undefined
  });

  transition: Transition;
  public static transitionProperty = new Property<FrescoDraweeBase, Transition>({
    name: "transition",
    defaultValue: undefined
  });
  public stretch: Stretch = "aspectFit";
  public static stretchProperty = new Property<FrescoDraweeBase, Stretch>({
    name: "stretch",
    defaultValue: "aspectFit"
  });

  private onImageUriPropertyChanged(oldValue: string, newValue: string) {
    this.onImageUriChanged(oldValue, newValue);
  }

  private onPlaceholderImageUriPropertyChanged(
    oldValue: string,
    newValue: string
  ) {
    this.onPlaceholderImageUriChanged(oldValue, newValue);
  }

  private onFailureImageUriPropertyChanged(oldValue: string, newValue: string) {
    this.onFailureImageUriChanged(oldValue, newValue);
  }

  private onActualImageScaleTypePropertyChanged(
    oldValue: string,
    newValue: string
  ) {
    this.onActualImageScaleTypeChanged(oldValue, newValue);
  }

  private onFadeDurationPropertyChanged(oldValue: number, newValue: number) {
    this.onFadeDurationChanged(oldValue, newValue);
  }

  private onBackgroundUriPropertyChanged(oldValue: string, newValue: string) {
    this.onBackgroundUriChanged(oldValue, newValue);
  }

  private onProgressiveRenderingEnabledPropertyChanged(
    oldValue: boolean,
    newValue: boolean
  ) {
    this.onProgressiveRenderingEnabledChanged(oldValue, newValue);
  }

  private onShowProgressBarPropertyChanged(
    oldValue: boolean,
    newValue: boolean
  ) {
    this.onShowProgressBarChanged(oldValue, newValue);
  }

  private onProgressBarColorPropertyChanged(
    oldValue: string,
    newValue: string
  ) {
    this.onProgressBarColorChanged(oldValue, newValue);
  }

  private onRoundAsCirclePropertyChanged(oldValue: boolean, newValue: boolean) {
    this.onRoundAsCircleChanged(oldValue, newValue);
  }

  private onRoundTopLeftPropertyChanged(oldValue: boolean, newValue: boolean) {
    this.onRoundTopLeftChanged(oldValue, newValue);
  }

  private onRoundTopRightPropertyChanged(oldValue: boolean, newValue: boolean) {
    this.onRoundTopRightChanged(oldValue, newValue);
  }

  private onRoundBottomLeftPropertyChanged(
    oldValue: boolean,
    newValue: boolean
  ) {
    this.onRoundBottomLeftChanged(oldValue, newValue);
  }

  private onRoundBottomRightPropertyChanged(
    oldValue: boolean,
    newValue: boolean
  ) {
    this.onRoundBottomRightChanged(oldValue, newValue);
  }

  private onRoundedCornerRadiusPropertyChanged(
    oldValue: number,
    newValue: number
  ) {
    this.onRoundedCornerRadiusChanged(oldValue, newValue);
  }

  private onBlurRadiusPropertyChanged(oldValue: number, newValue: number) {
    this.onBlurRadiusChanged(oldValue, newValue);
  }

  private onBlurDownSamplingPropertyChanged(
    oldValue: number,
    newValue: number
  ) {
    this.onBlurDownSamplingChanged(oldValue, newValue);
  }

  private onAutoPlayAnimationsPropertyChanged(
    oldValue: boolean,
    newValue: boolean
  ) {
    this.onAutoPlayAnimationsPChanged(oldValue, newValue);
  }

  private onTapToRetryEnabledPropertyChanged(
    oldValue: boolean,
    newValue: boolean
  ) {
    this.onTapToRetryEnabledChanged(oldValue, newValue);
  }

  private onAspectRatioPropertyChanged(oldValue: number, newValue: number) {
    this.onAspectRatioChanged(oldValue, newValue);
  }

  private onDecodeWidthPropertyChanged(oldValue: number, newValue: number) {
    this.onDecodeWidthChanged(oldValue, newValue);
  }

  private onDecodeHeightPropertyChanged(oldValue: number, newValue: number) {
    this.onDecodeHeightChanged(oldValue, newValue);
  }

  protected onImageUriChanged(oldValue: string, newValue: string) {}

  protected onPlaceholderImageUriChanged(oldValue: string, newValue: string) {}

  protected onFailureImageUriChanged(oldValue: string, newValue: string) {}

  protected onActualImageScaleTypeChanged(oldValue: string, newValue: string) {}

  protected onFadeDurationChanged(oldValue: number, newValue: number) {}

  protected onBackgroundUriChanged(oldValue: string, newValue: string) {}

  protected onProgressiveRenderingEnabledChanged(
    oldValue: boolean,
    newValue: boolean
  ) {}

  protected onShowProgressBarChanged(oldValue: boolean, newValue: boolean) {}

  protected onProgressBarColorChanged(oldValue: string, newValue: string) {}

  protected onRoundAsCircleChanged(oldValue: boolean, newValue: boolean) {}

  protected onRoundTopLeftChanged(oldValue: boolean, newValue: boolean) {}

  protected onRoundTopRightChanged(oldValue: boolean, newValue: boolean) {}

  protected onRoundBottomLeftChanged(oldValue: boolean, newValue: boolean) {}

  protected onRoundBottomRightChanged(oldValue: boolean, newValue: boolean) {}

  protected onRoundedCornerRadiusChanged(oldValue: number, newValue: number) {}

  protected onBlurRadiusChanged(oldValue: number, newValue: number) {}

  protected onBlurDownSamplingChanged(oldValue: number, newValue: number) {}

  protected onAutoPlayAnimationsPChanged(
    oldValue: boolean,
    newValue: boolean
  ) {}

  protected onTapToRetryEnabledChanged(oldValue: boolean, newValue: boolean) {}

  protected onAspectRatioChanged(oldValue: number, newValue: number) {}

  protected onDecodeWidthChanged(oldValue: number, newValue: number) {}

  protected onDecodeHeightChanged(oldValue: number, newValue: number) {}
}
FrescoDraweeBase.imageUriProperty.register(FrescoDraweeBase);
FrescoDraweeBase.placeholderImageUriProperty.register(FrescoDraweeBase);
FrescoDraweeBase.failureImageUriProperty.register(FrescoDraweeBase);
FrescoDraweeBase.actualImageScaleTypeProperty.register(FrescoDraweeBase);
FrescoDraweeBase.fadeDurationProperty.register(FrescoDraweeBase);
FrescoDraweeBase.backgroundUriProperty.register(FrescoDraweeBase);
FrescoDraweeBase.progressiveRenderingEnabledProperty.register(FrescoDraweeBase);
FrescoDraweeBase.showProgressBarProperty.register(FrescoDraweeBase);
FrescoDraweeBase.progressBarColorProperty.register(FrescoDraweeBase);
FrescoDraweeBase.roundAsCircleProperty.register(FrescoDraweeBase);
FrescoDraweeBase.roundTopLeftProperty.register(FrescoDraweeBase);
FrescoDraweeBase.roundTopRightProperty.register(FrescoDraweeBase);
FrescoDraweeBase.roundBottomLeftProperty.register(FrescoDraweeBase);
FrescoDraweeBase.roundBottomRightProperty.register(FrescoDraweeBase);
FrescoDraweeBase.roundedCornerRadiusProperty.register(FrescoDraweeBase);
FrescoDraweeBase.blurRadiusProperty.register(FrescoDraweeBase);
FrescoDraweeBase.blurDownSamplingProperty.register(FrescoDraweeBase);
FrescoDraweeBase.autoPlayAnimationsProperty.register(FrescoDraweeBase);
FrescoDraweeBase.tapToRetryEnabledProperty.register(FrescoDraweeBase);
FrescoDraweeBase.aspectRatioProperty.register(FrescoDraweeBase);
FrescoDraweeBase.decodeWidthProperty.register(FrescoDraweeBase);
FrescoDraweeBase.decodeHeightProperty.register(FrescoDraweeBase);
FrescoDraweeBase.onlyTransitionIfRemoteProperty.register(FrescoDraweeBase);
