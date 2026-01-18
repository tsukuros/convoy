import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class AssetPositionDto {
  @IsString()
  id: string;

  @IsArray()
  @IsNumber({}, { each: true })
  position: [number, number];

  @IsNumber()
  @Min(0)
  speed: number;

  @IsNumber()
  @Min(0)
  @Max(360)
  heading: number;

  @IsOptional()
  @IsNumber()
  altitude?: number;
}

export class SubscribeAssetsDto {
  @IsOptional()
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  types?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  statuses?: string[];
}

export class SubscribeAssetDto {
  @IsString()
  assetId: string;
}
