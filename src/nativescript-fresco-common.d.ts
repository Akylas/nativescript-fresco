import { View, Property, Color } from "tns-core-modules/ui/core/view";
import * as observableModule from "tns-core-modules/data/observable";
export declare type Transition = "fade" | "curlUp";
export declare enum ScaleType {
    Center = "center",
    CenterCrop = "centerCrop",
    CenterInside = "centerInside",
    FitCenter = "fitCenter",
    FitEnd = "fitEnd",
    FitStart = "fitStart",
    FitXY = "fitXY",
    FocusCrop = "focusCrop",
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
export declare class EventData implements observableModule.EventData {
    private _eventName;
    private _object;
    eventName: string;
    object: any;
}
export declare type Stretch = "none" | "fill" | "aspectFill" | "aspectFit";
export declare class FrescoDraweeBase extends View {
    static finalImageSetEvent: string;
    static failureEvent: string;
    static intermediateImageFailedEvent: string;
    static intermediateImageSetEvent: string;
    static releaseEvent: string;
    static submitEvent: string;
    imageUri: string;
    placeholderImageUri: string;
    failureImageUri: string;
    actualImageScaleType: ScaleType;
    fadeDuration: number;
    backgroundUri: string;
    progressiveRenderingEnabled: boolean;
    showProgressBar: boolean;
    progressBarColor: string;
    roundAsCircle: boolean;
    roundBottomRight: boolean;
    roundTopLeft: boolean;
    roundTopRight: boolean;
    roundBottomLeft: boolean;
    roundedCornerRadius: number;
    blurRadius: number;
    blurDownSampling: number;
    autoPlayAnimations: boolean;
    tapToRetryEnabled: boolean;
    aspectRatio: number;
    decodeWidth: number;
    decodeHeight: number;
    readonly isLoading: boolean;
    static imageUriProperty: Property<FrescoDraweeBase, string>;
    static placeholderImageUriProperty: Property<FrescoDraweeBase, string>;
    static failureImageUriProperty: Property<FrescoDraweeBase, string>;
    static actualImageScaleTypeProperty: Property<FrescoDraweeBase, string>;
    static fadeDurationProperty: Property<FrescoDraweeBase, number>;
    static backgroundUriProperty: Property<FrescoDraweeBase, string>;
    static progressiveRenderingEnabledProperty: Property<FrescoDraweeBase, boolean>;
    static showProgressBarProperty: Property<FrescoDraweeBase, boolean>;
    static progressBarColorProperty: Property<FrescoDraweeBase, string>;
    static roundAsCircleProperty: Property<FrescoDraweeBase, boolean>;
    static roundTopLeftProperty: Property<FrescoDraweeBase, boolean>;
    static roundTopRightProperty: Property<FrescoDraweeBase, boolean>;
    static roundBottomLeftProperty: Property<FrescoDraweeBase, boolean>;
    static roundBottomRightProperty: Property<FrescoDraweeBase, boolean>;
    static roundedCornerRadiusProperty: Property<FrescoDraweeBase, number>;
    static blurRadiusProperty: Property<FrescoDraweeBase, number>;
    static blurDownSamplingProperty: Property<FrescoDraweeBase, number>;
    static autoPlayAnimationsProperty: Property<FrescoDraweeBase, boolean>;
    static tapToRetryEnabledProperty: Property<FrescoDraweeBase, boolean>;
    static aspectRatioProperty: Property<FrescoDraweeBase, number>;
    static decodeWidthProperty: Property<FrescoDraweeBase, number>;
    static decodeHeightProperty: Property<FrescoDraweeBase, number>;
    onlyTransitionIfRemote: boolean;
    static onlyTransitionIfRemoteProperty: Property<FrescoDraweeBase, boolean>;
    tintColor: Color;
    static tintColorProperty: Property<FrescoDraweeBase, Color>;
    transition: Transition;
    static transitionProperty: Property<FrescoDraweeBase, Transition>;
    stretch: Stretch;
    static stretchProperty: Property<FrescoDraweeBase, Stretch>;
    private onImageUriPropertyChanged(oldValue, newValue);
    private onPlaceholderImageUriPropertyChanged(oldValue, newValue);
    private onFailureImageUriPropertyChanged(oldValue, newValue);
    private onActualImageScaleTypePropertyChanged(oldValue, newValue);
    private onFadeDurationPropertyChanged(oldValue, newValue);
    private onBackgroundUriPropertyChanged(oldValue, newValue);
    private onProgressiveRenderingEnabledPropertyChanged(oldValue, newValue);
    private onShowProgressBarPropertyChanged(oldValue, newValue);
    private onProgressBarColorPropertyChanged(oldValue, newValue);
    private onRoundAsCirclePropertyChanged(oldValue, newValue);
    private onRoundTopLeftPropertyChanged(oldValue, newValue);
    private onRoundTopRightPropertyChanged(oldValue, newValue);
    private onRoundBottomLeftPropertyChanged(oldValue, newValue);
    private onRoundBottomRightPropertyChanged(oldValue, newValue);
    private onRoundedCornerRadiusPropertyChanged(oldValue, newValue);
    private onBlurRadiusPropertyChanged(oldValue, newValue);
    private onBlurDownSamplingPropertyChanged(oldValue, newValue);
    private onAutoPlayAnimationsPropertyChanged(oldValue, newValue);
    private onTapToRetryEnabledPropertyChanged(oldValue, newValue);
    private onAspectRatioPropertyChanged(oldValue, newValue);
    private onDecodeWidthPropertyChanged(oldValue, newValue);
    private onDecodeHeightPropertyChanged(oldValue, newValue);
    protected onImageUriChanged(oldValue: string, newValue: string): void;
    protected onPlaceholderImageUriChanged(oldValue: string, newValue: string): void;
    protected onFailureImageUriChanged(oldValue: string, newValue: string): void;
    protected onActualImageScaleTypeChanged(oldValue: string, newValue: string): void;
    protected onFadeDurationChanged(oldValue: number, newValue: number): void;
    protected onBackgroundUriChanged(oldValue: string, newValue: string): void;
    protected onProgressiveRenderingEnabledChanged(oldValue: boolean, newValue: boolean): void;
    protected onShowProgressBarChanged(oldValue: boolean, newValue: boolean): void;
    protected onProgressBarColorChanged(oldValue: string, newValue: string): void;
    protected onRoundAsCircleChanged(oldValue: boolean, newValue: boolean): void;
    protected onRoundTopLeftChanged(oldValue: boolean, newValue: boolean): void;
    protected onRoundTopRightChanged(oldValue: boolean, newValue: boolean): void;
    protected onRoundBottomLeftChanged(oldValue: boolean, newValue: boolean): void;
    protected onRoundBottomRightChanged(oldValue: boolean, newValue: boolean): void;
    protected onRoundedCornerRadiusChanged(oldValue: number, newValue: number): void;
    protected onBlurRadiusChanged(oldValue: number, newValue: number): void;
    protected onBlurDownSamplingChanged(oldValue: number, newValue: number): void;
    protected onAutoPlayAnimationsPChanged(oldValue: boolean, newValue: boolean): void;
    protected onTapToRetryEnabledChanged(oldValue: boolean, newValue: boolean): void;
    protected onAspectRatioChanged(oldValue: number, newValue: number): void;
    protected onDecodeWidthChanged(oldValue: number, newValue: number): void;
    protected onDecodeHeightChanged(oldValue: number, newValue: number): void;
}
