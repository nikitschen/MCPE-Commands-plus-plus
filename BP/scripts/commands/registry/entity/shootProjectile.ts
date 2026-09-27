/* SPDX-License-Identifier: GPL-3.0-or-later
 * ============================================================================
 * Commands Plus Plus
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Commands-plus-plus
 * ============================================================================
 *
 * This file is part of Commands Plus Plus.
 *
 * Commands Plus Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Commands Plus Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Commands Plus Plus. If not, see <https://www.gnu.org/licenses/>.
 */

import {
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
    Entity,
    EntityType,
    EntityTypes,
    system,
    world,
} from "@minecraft/server";

import { Vector } from "../../../utils/vector.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "shootprojectile",
        description: "Shoots projectile",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "targets", type: CustomCommandParamType.EntitySelector }],
        optionalParameters: [
            { name: "projectile", type: CustomCommandParamType.EntityType },
            { name: "speed", type: CustomCommandParamType.Float },
        ],
    },
    (
        origin,
        targets: Entity[],
        projectile: EntityType = EntityTypes.get("minecraft:arrow")!,
        speed: number = 1
    ) => {
        system.run(() => {
            for (const entity of targets) {
                const entityViewDirection = entity.getViewDirection();
                const spawnedProjectile = entity.dimension.spawnEntity(
                    projectile,
                    Vector.locationInfront(entity.getHeadLocation(), entityViewDirection, 1)
                );
                spawnedProjectile.applyImpulse(Vector.multiply(entityViewDirection, speed));
            }
        });
        return { status: CustomCommandStatus.Success, message: "Projectile shot" };
    }
);
